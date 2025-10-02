import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const execAsync = promisify(exec);

class OrdinalInscriptionService {
    constructor() {
        this.bitcoinNetwork = process.env.BITCOIN_NETWORK || 'signet';

        // Explicitly check for 'false' string - if undefined, default to true (mock mode)
        const mockEnv = process.env.MOCK_INSCRIPTIONS;
        this.mockMode = mockEnv === undefined ? true : mockEnv !== 'false';

        this.tempDir = './data/inscriptions';
        this.rpcUrl = 'http://127.0.0.1:38332';
        this.rpcUser = 'bitcoinrpc';
        this.rpcPass = 'CHANGE_THIS_PASSWORD_12345';
        this.wallet = 'ord';

        console.log('OrdinalInscriptionService initialized:');
        console.log('  MOCK_INSCRIPTIONS env:', process.env.MOCK_INSCRIPTIONS);
        console.log('  Mock mode:', this.mockMode);
        console.log('  Network:', this.bitcoinNetwork);
    }

    async init() {
        await fs.mkdir(this.tempDir, { recursive: true });
    }

    // Bitcoin Core RPC call helper
    async bitcoinRpc(method, params = []) {
        const rpcCall = {
            jsonrpc: '1.0',
            id: 'truthvault',
            method,
            params
        };

        const command = `curl -s --user ${this.rpcUser}:${this.rpcPass} \
            --data-binary '${JSON.stringify(rpcCall).replace(/'/g, "'\\''")}' \
            -H 'content-type: text/plain;' \
            ${this.rpcUrl}`;

        try {
            const { stdout } = await execAsync(command);
            const response = JSON.parse(stdout);

            if (response.error) {
                throw new Error(response.error.message);
            }

            return response.result;
        } catch (error) {
            console.error(`RPC ${method} failed:`, error.message);
            throw error;
        }
    }

    async inscribe(data) {
        await this.init();

        const content = typeof data === 'string' ? data : JSON.stringify(data);

        console.log('Inscribe called - mock mode:', this.mockMode);

        if (this.mockMode) {
            return await this.mockInscribe(content);
        }

        return await this.realInscribe(content);
    }

    async mockInscribe(content) {
        const inscriptionId = `${Date.now()}${Math.random().toString(36).substring(2, 8)}i0`;

        console.log('Mock Inscription created:', {
            id: inscriptionId,
            size: content.length,
            network: this.bitcoinNetwork
        });

        const inscriptionData = {
            inscriptionId,
            content,
            timestamp: new Date().toISOString(),
            network: this.bitcoinNetwork,
            size: content.length,
            mock: true
        };

        const filePath = path.join(this.tempDir, `${inscriptionId}.json`);
        await fs.writeFile(filePath, JSON.stringify(inscriptionData, null, 2));

        return {
            inscriptionId,
            timestamp: new Date().toISOString(),
            size: content.length,
            fees: { total: 0, rate: 0 },
            mock: true
        };
    }

    async realInscribe(content) {
        try {
            console.log('Creating real inscription via Bitcoin Core RPC...');

            // Load wallet
            try {
                await this.bitcoinRpc('loadwallet', [this.wallet]);
            } catch (e) {
                if (!e.message.includes('already loaded')) {
                    console.warn('Wallet load warning:', e.message);
                }
            }

            // Get change address
            const changeAddress = await this.bitcoinRpc('getrawchangeaddress', ['bech32m']);

            // Convert content to hex
            const contentBuffer = Buffer.from(content, 'utf8');
            const contentHash = crypto.createHash('sha256').update(content).digest('hex');

            // Bitcoin OP_RETURN is limited to 80 bytes for standard relay
            // For large content, store hash on-chain, full content locally
            let dataHex;
            let storageType;

            if (contentBuffer.length > 75) {
                // Store "ord:" prefix + SHA256 hash (4 + 32 = 36 bytes)
                const prefix = Buffer.from('ord:', 'utf8').toString('hex');
                dataHex = prefix + contentHash;
                storageType = 'hash';
                console.log('Content size:', contentBuffer.length, 'bytes - storing hash on-chain');
            } else {
                // Store full content on-chain
                const ordPrefix = Buffer.from('ord', 'utf8').toString('hex');
                dataHex = ordPrefix + contentBuffer.toString('hex');
                storageType = 'full';
                console.log('Content size:', contentBuffer.length, 'bytes - storing full content on-chain');
            }

            console.log('OP_RETURN data size:', dataHex.length / 2, 'bytes');

            // Create transaction with OP_RETURN (empty inputs - fundrawtransaction will add them)
            const outputs = [{ data: dataHex }];
            const rawTx = await this.bitcoinRpc('createrawtransaction', [[], outputs]);

            // Fund transaction (adds inputs and change output automatically)
            console.log('Funding transaction...');
            const fundedResult = await this.bitcoinRpc('fundrawtransaction', [rawTx, {
                feeRate: 0.00001,
                changeAddress: changeAddress
            }]);

            // Sign transaction
            console.log('Signing transaction...');
            const signedResult = await this.bitcoinRpc('signrawtransactionwithwallet', [fundedResult.hex]);

            if (!signedResult.complete) {
                throw new Error('Transaction signing failed: ' + JSON.stringify(signedResult.errors || 'Unknown'));
            }

            // Broadcast transaction
            console.log('Broadcasting transaction...');
            const txid = await this.bitcoinRpc('sendrawtransaction', [signedResult.hex]);

            const inscriptionId = `${txid}i0`;

            console.log('✅ Inscription created successfully!');
            console.log('   TXID:', txid);
            console.log('   Inscription ID:', inscriptionId);
            console.log('   Storage:', storageType === 'hash' ? 'Hash on-chain, full content local' : 'Full content on-chain');
            console.log('   View: https://mempool.space/signet/tx/' + txid);

            // Save full content locally
            const inscriptionData = {
                inscriptionId,
                txid,
                content,
                contentHash,
                storageType,
                timestamp: new Date().toISOString(),
                network: this.bitcoinNetwork,
                size: content.length,
                mock: false
            };

            const filePath = path.join(this.tempDir, `${inscriptionId}.json`);
            await fs.writeFile(filePath, JSON.stringify(inscriptionData, null, 2));

            return {
                inscriptionId,
                txid,
                timestamp: new Date().toISOString(),
                size: content.length,
                fees: {
                    total: Math.round(fundedResult.fee * 100000000),
                    rate: 1
                },
                network: this.bitcoinNetwork,
                storageType,
                mock: false
            };

        } catch (error) {
            console.error('Real inscription failed:', error.message);
            throw new Error('Failed to create inscription: ' + error.message);
        }
    }

    async getBalance() {
        try {
            const balance = await this.bitcoinRpc('getbalance');
            return balance;
        } catch (error) {
            console.error('Failed to get balance:', error);
            return 0;
        }
    }

    async getNewAddress() {
        try {
            const address = await this.bitcoinRpc('getnewaddress', ['', 'bech32m']);
            return address;
        } catch (error) {
            console.error('Failed to get address:', error);
            throw error;
        }
    }

    async fetchInscription(inscriptionId) {
        try {
            const filePath = path.join(this.tempDir, `${inscriptionId}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            if (!this.mockMode) {
                try {
                    const url = `http://localhost:8080/inscription/${inscriptionId}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        return await response.json();
                    }
                } catch (fetchError) {
                    console.error('Failed to fetch from ord server:', fetchError);
                }
            }
            throw new Error('Inscription not found');
        }
    }

    async verifyInscription(inscriptionId) {
        if (this.mockMode) {
            return {
                valid: true,
                inscriptionId,
                message: 'Mock inscription verified'
            };
        }

        try {
            const txid = inscriptionId.split('i')[0];
            const tx = await this.bitcoinRpc('getrawtransaction', [txid, true]);

            return {
                valid: true,
                inscriptionId,
                txid,
                confirmations: tx.confirmations || 0,
                message: 'Inscription verified on blockchain'
            };
        } catch (error) {
            return {
                valid: false,
                inscriptionId,
                message: 'Inscription not found on blockchain'
            };
        }
    }
}

export const ordinalInscription = new OrdinalInscriptionService();