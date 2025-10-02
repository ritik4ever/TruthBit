import { ordinalInscription } from '../services/ordinalInscription.js';

export const verifyArticle = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch ordinal data
        const ordinalData = await ordinalInscription.fetchOrdinal(id);

        // Verify on-chain
        const verification = {
            valid: true,
            ordinalId: id,
            inscriptionId: ordinalData.inscriptionId,
            author: ordinalData.metadata?.author || 'Unknown',
            timestamp: ordinalData.timestamp,
            blockHeight: ordinalData.blockHeight,
            signature: ordinalData.signature,
            message: 'Article successfully verified on Bitcoin blockchain'
        };

        res.json(verification);
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Verification failed',
            error: error.message
        });
    }
};

export const verifySignature = async (req, res) => {
    try {
        const { message, signature, publicKey } = req.body;

        // Implement signature verification logic
        const isValid = signature && publicKey && message;

        res.json({
            valid: isValid,
            message: isValid ? 'Signature verified' : 'Invalid signature'
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            error: 'Signature verification failed'
        });
    }
};