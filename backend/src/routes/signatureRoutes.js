import express from 'express';
import { ordinalInscription } from '../services/ordinalInscription.js';
import { database } from '../services/database.js';

const router = express.Router();

// Sign a document and inscribe signature
router.post('/sign', async (req, res) => {
    try {
        const { documentHash, documentName, signerName, signerAddress, signature } = req.body;

        if (!documentHash || !signerAddress || !signature) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create signature data to inscribe
        const signatureData = {
            type: 'document-signature',
            protocol: 'truthbit-signature-v1',
            documentHash,
            documentName: documentName || 'Unknown Document',
            signerName: signerName || 'Anonymous',
            signerAddress,
            signature,
            timestamp: new Date().toISOString()
        };

        // Inscribe signature on Bitcoin
        const inscription = await ordinalInscription.inscribe(signatureData);

        // Save to database
        const signatureRecord = {
            id: 'sig_' + Date.now(),
            ...signatureData,
            inscriptionId: inscription.inscriptionId,
            txid: inscription.txid
        };

        await database.saveSignature(signatureRecord);

        res.json({
            success: true,
            ...signatureRecord
        });
    } catch (error) {
        console.error('Signature inscription failed:', error);
        res.status(500).json({ error: 'Failed to inscribe signature' });
    }
});

// Verify a document signature
router.post('/verify', async (req, res) => {
    try {
        const { documentHash } = req.body;

        if (!documentHash) {
            return res.status(400).json({ error: 'Document hash required' });
        }

        // Find all signatures for this document
        const signatures = await database.getSignatures({ documentHash });

        if (signatures.length === 0) {
            return res.json({
                verified: false,
                message: 'No signatures found for this document'
            });
        }

        res.json({
            verified: true,
            signatures: signatures.map(sig => ({
                id: sig.id,
                signerName: sig.signerName,
                signerAddress: sig.signerAddress,
                timestamp: sig.timestamp,
                inscriptionId: sig.inscriptionId,
                txid: sig.txid
            }))
        });
    } catch (error) {
        console.error('Verification failed:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Get signatures by signer address
router.get('/by-address/:address', async (req, res) => {
    try {
        const { address } = req.params;
        const signatures = await database.getSignatures({ signerAddress: address });

        res.json(signatures);
    } catch (error) {
        console.error('Failed to fetch signatures:', error);
        res.status(500).json({ error: 'Failed to fetch signatures' });
    }
});

// Get signature by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const signature = await database.getSignature(id);

        if (!signature) {
            return res.status(404).json({ error: 'Signature not found' });
        }

        res.json(signature);
    } catch (error) {
        console.error('Failed to fetch signature:', error);
        res.status(500).json({ error: 'Failed to fetch signature' });
    }
});

export default router;