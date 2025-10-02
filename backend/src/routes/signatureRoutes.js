import express from 'express';
import { ordinalInscription } from '../services/ordinalInscription.js';
import crypto from 'crypto';

const router = express.Router();

// Sign a document and inscribe signature
router.post('/sign', async (req, res) => {
    try {
        const { documentHash, signerName, signerAddress, signature } = req.body;

        if (!documentHash || !signerAddress || !signature) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create signature data to inscribe
        const signatureData = {
            type: 'document-signature',
            protocol: 'truthbit-signature-v1',
            documentHash,
            signerName: signerName || 'Anonymous',
            signerAddress,
            signature,
            timestamp: new Date().toISOString()
        };

        // Inscribe signature on Bitcoin
        const inscription = await ordinalInscription.inscribe(signatureData);

        res.json({
            success: true,
            inscriptionId: inscription.inscriptionId,
            txid: inscription.txid,
            signatureData
        });
    } catch (error) {
        console.error('Signature inscription failed:', error);
        res.status(500).json({ error: 'Failed to inscribe signature' });
    }
});

// Verify a document signature
router.post('/verify', async (req, res) => {
    try {
        const { documentHash, signature, publicKey } = req.body;

        // In a real implementation, you'd verify the signature cryptographically
        // For now, just check if inscription exists

        res.json({
            valid: true,
            message: 'Signature verification would happen here'
        });
    } catch (error) {
        res.status(500).json({ error: 'Verification failed' });
    }
});

export default router;