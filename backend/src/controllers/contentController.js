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

        // Encrypt whistleblower or anonymous content
        if (classification === 'whistleblower' || anonymous || encrypted) {
            const encryptedResult = encryption.encryptContent(content);
            finalContent = encryptedResult.encrypted;

            encryptionData = {
                key: encryptedResult.key,
                iv: encryptedResult.iv,
                authTag: encryptedResult.authTag,
                algorithm: encryptedResult.algorithm
            };

            // Time-lock encryption
            if (unlockDate) {
                const timeLocked = encryption.createTimeLock(content, unlockDate);
                finalContent = timeLocked.encrypted;
                encryptionData = {
                    ...encryptionData,
                    timeLocked: true,
                    unlockDate,
                    salt: timeLocked.salt
                };
            }
        }

        // Inscribe to Bitcoin
        const inscriptionData = {
            title,
            content: finalContent,
            classification,
            encrypted: !!encryptionData,
            anonymous,
            publishedAt: new Date().toISOString()
        };

        const inscription = await ordinalInscription.inscribe(inscriptionData);

        // Save article
        const article = {
            id: 'article_' + Date.now(),
            ordinalId: inscription.inscriptionId,
            txid: inscription.txid,
            title,
            content: finalContent,
            excerpt: excerpt || content.substring(0, 200),
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

        // Response
        const response = {
            ...article,
            inscriptionDetails: inscription
        };

        // Only return decryption key if encrypted
        if (encryptionData) {
            response.decryptionKey = encryptionData.key;
            response.warning = 'SAVE THIS KEY! It cannot be recovered if lost.';
        }

        res.status(201).json(response);
    } catch (error) {
        console.error('Failed to create article:', error);
        res.status(500).json({
            error: 'Failed to publish article',
            message: error.message
        });
    }
};

export const getArticles = async (req, res) => {
    try {
        const { classification, author } = req.query;
        const filters = {};

        if (classification) filters.classification = classification;
        if (author) filters.author = author;

        const articles = await database.getArticles(filters);

        // Don't send encryption keys or encrypted content in list
        const sanitized = articles.map(a => ({
            ...a,
            encryptionData: a.encrypted ? { encrypted: true } : null,
            content: a.encrypted ? '[ENCRYPTED]' : a.excerpt || a.content.substring(0, 200)
        }));

        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
};

export const getArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await database.getArticle(id);

        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Don't send decryption key, only encryption metadata
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
        res.status(500).json({ error: 'Failed to fetch article' });
    }
};

export const incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        await database.incrementViews(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to increment views' });
    }
};