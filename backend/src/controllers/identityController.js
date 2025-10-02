import { ordinalInscription } from '../services/ordinalInscription.js';

let identities = [];

export const createIdentity = async (req, res) => {
    try {
        const { name, credentialType, verificationLevel, publicKey } = req.body;

        const identityData = {
            identity: {
                credentialType,
                verificationLevel,
                publicKey
            }
        };

        const inscription = await ordinalInscription.inscribe(identityData);

        const identity = {
            id: 'identity_' + Date.now(),
            ordinalId: inscription.inscriptionId,
            name,
            credentialType,
            verificationLevel,
            publicKey,
            createdAt: new Date().toISOString(),
            articlesPublished: 0
        };

        identities.push(identity);

        res.status(201).json(identity);
    } catch (error) {
        console.error('Failed to create identity:', error);
        res.status(500).json({ error: 'Failed to create identity' });
    }
};

export const getIdentity = async (req, res) => {
    try {
        const { id } = req.params;
        const identity = identities.find(i => i.id === id || i.ordinalId === id);

        if (!identity) {
            return res.status(404).json({ error: 'Identity not found' });
        }

        res.json(identity);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch identity' });
    }
};

export const getIdentityArticles = async (req, res) => {
    try {
        const { id } = req.params;
        // This would fetch articles from database
        res.json([]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};