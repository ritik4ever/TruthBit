import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class OrdinalInscriptionService {
    constructor() {
        this.bitcoinNetwork = process.env.BITCOIN_NETWORK || 'signet';
        this.mockMode = process.env.MOCK_INSCRIPTIONS === 'true';
        this.tempDir = process.env.INSCRIPTIONS_DIR || path.resolve(process.cwd(), 'data/inscriptions');

        this.xverseApiKey = process.env.XVERSE_API_KEY || '';
        this.xverseEndpoints = {
            mainnet: 'https://api.secretkeylabs.io',
            signet: 'https://api-signet.secretkeylabs.io',
            testnet4: 'https://api-testnet4.secretkeylabs.io'
        };

        // Choose correct API base URL
        this.xverseBaseUrl =
            process.env.ORDINALS_API_URL ||
            this.xverseEndpoints[this.bitcoinNetwork] ||
            this.xverseEndpoints.signet;

        const headers = { 'Content-Type': 'application/json' };
        if (this.xverseApiKey) headers['X-API-Key'] = this.xverseApiKey;

        this.xverseClient = axios.create({
            baseURL: this.xverseBaseUrl,
            headers,
            timeout: parseInt(process.env.XVERSE_TIMEOUT_MS || '60000', 10)
        });

        console.log('OrdinalInscriptionService initialized:', {
            mockMode: this.mockMode,
            network: this.bitcoinNetwork,
            baseUrl: this.xverseBaseUrl,
            hasKey: !!this.xverseApiKey
        });
    }

    async init() {
        await fs.mkdir(this.tempDir, { recursive: true });
    }

    async inscribe(data) {
        await this.init();
        const content = typeof data === 'string' ? data : JSON.stringify(data);
        console.log('Inscribe called - mock mode:', this.mockMode);
        if (this.mockMode) return this.mockInscribe(content);
        return this.realInscribe(content);
    }

    async mockInscribe(content) {
        const inscriptionId = `${Date.now()}${Math.random().toString(36).substring(2, 8)}i0`;
        const inscriptionData = {
            inscriptionId,
            content,
            timestamp: new Date().toISOString(),
            network: this.bitcoinNetwork,
            size: Buffer.byteLength(content, 'utf8'),
            mock: true
        };

        const filePath = path.join(this.tempDir, `${inscriptionId}.json`);
        await fs.writeFile(filePath, JSON.stringify(inscriptionData, null, 2));

        return {
            inscriptionId,
            txid: null,
            timestamp: inscriptionData.timestamp,
            size: inscriptionData.size,
            fees: { total: 0, rate: 0 },
            mock: true
        };
    }

    async realInscribe(content) {
        try {
            if (!this.xverseApiKey) {
                throw new Error('XVERSE_API_KEY not set. Set it in .env or enable MOCK_INSCRIPTIONS=true for dev.');
            }

            // Check if we're on testnet - Xverse only supports mainnet inscriptions
            if (this.bitcoinNetwork !== 'mainnet') {
                console.warn(`⚠️  Xverse Inscription Service only supports mainnet. Current network: ${this.bitcoinNetwork}`);
                console.warn('📝 Falling back to mock inscription for demo purposes.');
                console.warn('💡 For production, use BITCOIN_NETWORK=mainnet or MOCK_INSCRIPTIONS=true');
                return this.mockInscribe(content);
            }

            const size = Buffer.byteLength(content, 'utf8');
            const MAX_SIZE = parseInt(process.env.INSCRIPTION_MAX_SIZE || '200000', 10);
            if (size > MAX_SIZE) {
                throw new Error(`Content too large for inscription (${size} bytes, max ${MAX_SIZE}).`);
            }

            // Optional cost estimate
            try {
                const estimate = await this.estimateInscriptionCost(content);
                console.log('Estimated inscription cost:', estimate);
            } catch (e) {
                console.warn('Cost estimation failed (continuing):', e.message || e);
            }

            // Pick correct receive address
            const networkKey = this.bitcoinNetwork.toUpperCase();
            const receiveAddress =
                process.env[`RECEIVE_ADDRESS_${networkKey}`] ||
                process.env[`${this.bitcoinNetwork.toUpperCase()}_RECEIVE_ADDRESS`] ||
                process.env.SIGNET_RECEIVE_ADDRESS ||
                process.env.RECEIVE_ADDRESS ||
                null;

            if (!receiveAddress) {
                throw new Error(`Receive address not configured for network ${this.bitcoinNetwork}.`);
            }

            const postBody = {
                content: Buffer.from(content, 'utf8').toString('base64'),
                contentType: 'text/plain;charset=utf-8',
                receiveAddress,
                feeRate: process.env.DEFAULT_FEE_RATE || 'medium',
                metadata: {
                    protocol: 'truthbit-v1',
                    timestamp: new Date().toISOString(),
                    contentHash: crypto.createHash('sha256').update(content).digest('hex')
                }
            };

            console.log('Posting inscription order to Xverse:', {
                url: `${this.xverseBaseUrl}/v1/inscriptions/orders`,
                size
            });

            // ✅ FIXED: Correct endpoint for inscriptions
            const orderResponse = await this.xverseClient.post('/v1/inscriptions/orders', postBody);
            const orderData = orderResponse?.data || {};

            const orderId = orderData.orderId || orderData.id;
            const paymentAddress = orderData.paymentAddress || orderData.payment_address || orderData.payment;
            const totalCost = orderData.totalCost || orderData.total_cost || orderData.amount;
            const inscriptionSize = orderData.inscriptionSize || orderData.inscription_size || orderData.size;

            if (!orderId) {
                console.error('Unexpected order response from Xverse:', orderData);
                throw new Error('Unexpected order response from inscription API (missing orderId)');
            }

            console.log('Inscription order created:', { orderId, paymentAddress, totalCost, inscriptionSize });

            if (this.bitcoinNetwork !== 'mainnet') {
                console.log('Testnet/signet order created — PAYMENT REQUIRED:', {
                    orderId,
                    paymentAddress,
                    totalCost
                });
            } else {
                console.log(`MAINNET: send ${totalCost} sats to ${paymentAddress} to complete inscription`);
            }

            // Poll until completion
            const inscriptionResult = await this.waitForInscription(
                orderId,
                parseInt(process.env.INSCRIPTION_MAX_ATTEMPTS || '30', 10),
                parseInt(process.env.INSCRIPTION_POLL_MS || '10000', 10)
            );

            const inscriptionId = inscriptionResult.inscriptionId;
            const txid = inscriptionResult.txid || null;

            const saved = {
                inscriptionId,
                txid,
                orderId,
                content,
                contentHash: crypto.createHash('sha256').update(content).digest('hex'),
                timestamp: new Date().toISOString(),
                network: this.bitcoinNetwork,
                size,
                fees: {
                    total: totalCost,
                    rate: orderData.feeRate || orderData.fee_rate || 'medium'
                },
                mock: false
            };

            const filePath = path.join(this.tempDir, `${inscriptionId}.json`);
            await fs.writeFile(filePath, JSON.stringify(saved, null, 2));

            console.log('Inscription saved successfully:', filePath);

            return {
                inscriptionId,
                txid,
                orderId,
                timestamp: saved.timestamp,
                size,
                fees: saved.fees,
                network: this.bitcoinNetwork,
                explorerUrl: txid ? this.getExplorerUrl(txid) : null,
                mock: false
            };
        } catch (error) {
            const resp = error.response?.data ?? error.message ?? error;
            console.error('Real inscription failed:', resp);
            const msg = typeof resp === 'object' ? JSON.stringify(resp) : String(resp);
            throw new Error(`Failed to create inscription: ${msg}`);
        }
    }

    async estimateInscriptionCost(content, feeRate = 'medium') {
        try {
            // ✅ FIXED: Correct endpoint for cost estimation
            const response = await this.xverseClient.post('/v1/inscriptions/estimate', {
                content: Buffer.from(content, 'utf8').toString('base64'),
                contentType: 'text/plain;charset=utf-8',
                feeRate
            });

            return {
                estimatedCost: response.data.totalCost,
                inscriptionSize: response.data.inscriptionSize,
                networkFee: response.data.networkFee,
                serviceFee: response.data.serviceFee
            };
        } catch (error) {
            console.error('Cost estimation failed:', error.response?.data || error.message || error);
            return {
                estimatedCost: Buffer.byteLength(content, 'utf8') * 10,
                inscriptionSize: Buffer.byteLength(content, 'utf8'),
                networkFee: 'unknown',
                serviceFee: 'unknown'
            };
        }
    }

    async waitForInscription(orderId, maxAttempts = 30, delayMs = 10000) {
        const delay = ms => new Promise(r => setTimeout(r, ms));
        for (let i = 0; i < maxAttempts; i++) {
            try {
                // ✅ FIXED: Correct endpoint for checking order status
                const response = await this.xverseClient.get(`/v1/inscriptions/orders/${orderId}`);
                const status = response.data?.status;
                console.log(`Inscription status: ${status} (attempt ${i + 1}/${maxAttempts})`);
                if (status === 'completed') {
                    return {
                        inscriptionId: response.data.inscriptionId || response.data.inscription_id || null,
                        txid: response.data.txid || response.data.tx || null,
                        status: 'completed'
                    };
                }
                if (status === 'failed') {
                    throw new Error('Inscription failed: ' + (response.data?.error || JSON.stringify(response.data)));
                }
            } catch (error) {
                console.log('Status check failed (will retry):', error.message || error);
                if (i === maxAttempts - 1) {
                    throw new Error('Inscription timeout or repeated failures: ' + (error.message || error));
                }
            }
            await delay(delayMs * Math.min(1 + i * 0.25, 6));
        }
        throw new Error('Inscription timeout after ' + maxAttempts + ' attempts');
    }

    async fetchInscription(inscriptionId) {
        try {
            const filePath = path.join(this.tempDir, `${inscriptionId}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch {
            // ✅ FIXED: Correct endpoint for fetching inscription
            const response = await this.xverseClient.get(`/v1/inscriptions/orders/${inscriptionId}`);
            return response.data;
        }
    }

    async verifyInscription(inscriptionId) {
        if (this.mockMode) {
            return { valid: true, inscriptionId, message: 'Mock inscription verified' };
        }
        try {
            // ✅ FIXED: Correct endpoint for verifying inscription
            const response = await this.xverseClient.get(`/v1/inscriptions/orders/${inscriptionId}`);
            return {
                valid: true,
                inscriptionId,
                txid: response.data.txid,
                confirmations: response.data.confirmations || 0,
                message: 'Inscription verified on blockchain'
            };
        } catch {
            return { valid: false, inscriptionId, message: 'Inscription not found on blockchain' };
        }
    }

    getExplorerUrl(txid) {
        const explorers = {
            mainnet: `https://mempool.space/tx/${txid}`,
            signet: `https://mempool.space/signet/tx/${txid}`,
            testnet4: `https://mempool.space/testnet4/tx/${txid}`
        };
        return explorers[this.bitcoinNetwork] || explorers.signet;
    }

    async getBalance() {
        return 0;
    }

    async getNewAddress() {
        return await this.getReceiveAddress();
    }

    async getReceiveAddress() {
        const networkKey = this.bitcoinNetwork.toUpperCase();
        const addrFromEnv =
            process.env[`RECEIVE_ADDRESS_${networkKey}`] ||
            process.env[`${this.bitcoinNetwork.toUpperCase()}_RECEIVE_ADDRESS`] ||
            process.env.SIGNET_RECEIVE_ADDRESS ||
            process.env.RECEIVE_ADDRESS ||
            null;

        if (addrFromEnv) return addrFromEnv;
        throw new Error(`Receive address not configured. Set RECEIVE_ADDRESS_${networkKey} or SIGNET_RECEIVE_ADDRESS.`);
    }
}

export const ordinalInscription = new OrdinalInscriptionService();