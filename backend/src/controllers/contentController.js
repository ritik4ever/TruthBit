import { ordinalInscription } from '../services/ordinalInscription.js';
import { encryption } from '../services/encryption.js';
import { database } from '../services/database.js';

export const createArticle = async (req, res) => {
    try {
        const {
            title,
            content,
            excerpt,
            classification,
            encrypted,
            unlockDate,
            tags,
            authorId,
            authorName,
            anonymous = false
        } = req.body;

        let finalContent = content;
        let encryptionData = null;

        if (classification === 'whistleblower' || anonymous || encrypted) {
            let encryptedResult;

            if (unlockDate) {
                encryptedResult = encryption.createTimeLock(content, unlockDate);
                finalContent = encryptedResult.encrypted;
                encryptionData = {
                    iv: encryptedResult.iv,
                    authTag: encryptedResult.authTag,
                    algorithm: encryptedResult.algorithm,
                    timeLocked: true,
                    unlockDate: unlockDate,
                    salt: encryptedResult.salt
                };
            } else {
                encryptedResult = encryption.encryptContent(content);
                finalContent = encryptedResult.encrypted;
                encryptionData = {
                    iv: encryptedResult.iv,
                    authTag: encryptedResult.authTag,
                    algorithm: encryptedResult.algorithm,
                    timeLocked: false
                };
            }

            encryptionData.key = encryptedResult.key; // don't save key in DB
        }

        // prepare inscription payload
        const inscriptionData = {
            title,
            content: finalContent,
            classification,
            encrypted: !!encryptionData,
            anonymous,
            publishedAt: new Date().toISOString()
        };

        // Try to inscribe; if it fails, save article as pending and return 202
        let inscription = null;
        try {
            inscription = await ordinalInscription.inscribe(inscriptionData);
        } catch (insErr) {
            console.error('Inscription failed — saving article as pending:', insErr);

            const pendingArticle = {
                id: 'article_' + Date.now(),
                ordinalId: null,
                txid: null,
                title,
                content: finalContent,
                excerpt: excerpt || (content ? content.substring(0, 200) : ''),
                classification,
                encrypted: !!encryptionData,
                encryptionData: encryptionData ? {
                    iv: encryptionData.iv,
                    authTag: encryptionData.authTag,
                    algorithm: encryptionData.algorithm,
                    timeLocked: encryptionData.timeLocked,
                    unlockDate: encryptionData.unlockDate,
                    salt: encryptionData.salt
                } : null,
                authorId: anonymous ? 'anonymous' : authorId,
                authorName: anonymous ? 'Anonymous' : authorName,
                anonymous,
                publishedAt: new Date().toISOString(),
                views: 0,
                tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
                inscriptionStatus: 'pending'
            };

            await database.saveArticle(pendingArticle);

            const response = {
                ...pendingArticle,
                inscriptionDetails: null,
                message: 'Article saved; inscription is pending (inscription service unavailable).'
            };

            if (encryptionData) {
                response.decryptionKey = encryptionData.key;
                response.warning = 'SAVE THIS KEY! It cannot be recovered if lost.';
            }

            return res.status(202).json(response);
        }

        // If inscription succeeded, save normally
        const article = {
            id: 'article_' + Date.now(),
            ordinalId: inscription.inscriptionId,
            txid: inscription.txid,
            title,
            content: finalContent,
            excerpt: excerpt || (content ? content.substring(0, 200) : ''),
            classification,
            encrypted: !!encryptionData,
            encryptionData: encryptionData ? {
                iv: encryptionData.iv,
                authTag: encryptionData.authTag,
                algorithm: encryptionData.algorithm,
                timeLocked: encryptionData.timeLocked,
                unlockDate: encryptionData.unlockDate,
                salt: encryptionData.salt
            } : null,
            authorId: anonymous ? 'anonymous' : authorId,
            authorName: anonymous ? 'Anonymous' : authorName,
            anonymous,
            publishedAt: inscriptionData.publishedAt,
            views: 0,
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
        };

        await database.saveArticle(article);

        const response = {
            ...article,
            inscriptionDetails: inscription
        };

        if (encryptionData) {
            response.decryptionKey = encryptionData.key;
            response.warning = 'SAVE THIS KEY! It cannot be recovered if lost.';
        }

        res.status(201).json(response);
    } catch (error) {
        console.error('Failed to create article:', error);
        res.status(500).json({ error: 'Failed to publish article', message: error.message });
    }
};

export const getArticles = async (req, res) => {
    try {
        const { classification, author } = req.query;
        const filters = {};
        if (classification) filters.classification = classification;
        if (author && author !== 'anonymous') filters.author = author;

        const articles = await database.getArticles(filters);
        const sanitized = articles.map(a => ({
            ...a,
            encryptionData: a.encrypted ? {
                encrypted: true,
                timeLocked: a.encryptionData?.timeLocked,
                unlockDate: a.encryptionData?.unlockDate
            } : null,
            content: a.encrypted ? '[ENCRYPTED]' : (a.excerpt || (a.content ? a.content.substring(0, 200) : ''))
        }));

        res.json(sanitized);
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

export const getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await database.getArticle(id);
        if (!article) return res.status(404).json({ error: 'Article not found' });

        const response = {
            ...article,
            encryptionData: article.encryptionData ? {
                algorithm: article.encryptionData.algorithm,
                timeLocked: article.encryptionData.timeLocked,
                unlockDate: article.encryptionData.unlockDate
            } : null
        };

        delete response.encryptionData?.key;
        res.json(response);
    } catch (error) {
        console.error('Failed to fetch article:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
};

export const incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        await database.incrementViews(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to increment views:', error);
        res.status(500).json({ error: 'Failed to increment views' });
    }
};
