import fs from 'fs/promises';
import path from 'path';

class DatabaseService {
    constructor() {
        this.dataDir = process.env.DATA_DIR || './data';
        this.identitiesFile = path.join(this.dataDir, 'identities.json');
        this.articlesFile = path.join(this.dataDir, 'articles.json');
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.dataDir, { recursive: true });

            // Initialize files if they don't exist
            await this.ensureFile(this.identitiesFile, []);
            await this.ensureFile(this.articlesFile, []);
        } catch (error) {
            console.error('Database initialization failed:', error);
        }
    }

    async ensureFile(filepath, defaultData) {
        try {
            await fs.access(filepath);
        } catch {
            await fs.writeFile(filepath, JSON.stringify(defaultData, null, 2));
        }
    }

    async readFile(filepath) {
        const content = await fs.readFile(filepath, 'utf8');
        return JSON.parse(content);
    }

    async writeFile(filepath, data) {
        await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    }

    // Identity operations
    async getIdentities() {
        return await this.readFile(this.identitiesFile);
    }

    async getIdentity(id) {
        const identities = await this.getIdentities();
        return identities.find(i => i.id === id || i.ordinalId === id);
    }

    async saveIdentity(identity) {
        const identities = await this.getIdentities();
        identities.push(identity);
        await this.writeFile(this.identitiesFile, identities);
        return identity;
    }

    async updateIdentity(id, updates) {
        const identities = await this.getIdentities();
        const index = identities.findIndex(i => i.id === id);

        if (index === -1) {
            throw new Error('Identity not found');
        }

        identities[index] = { ...identities[index], ...updates };
        await this.writeFile(this.identitiesFile, identities);
        return identities[index];
    }

    // Article operations
    async getArticles(filters = {}) {
        let articles = await this.readFile(this.articlesFile);

        if (filters.classification) {
            articles = articles.filter(a => a.classification === filters.classification);
        }

        if (filters.author) {
            articles = articles.filter(a => a.authorId === filters.author);
        }

        return articles;
    }

    async getArticle(id) {
        const articles = await this.getArticles();
        return articles.find(a => a.id === id || a.ordinalId === id);
    }

    async saveArticle(article) {
        const articles = await this.getArticles();
        articles.unshift(article);
        await this.writeFile(this.articlesFile, articles);
        return article;
    }

    async updateArticle(id, updates) {
        const articles = await this.getArticles();
        const index = articles.findIndex(a => a.id === id);

        if (index === -1) {
            throw new Error('Article not found');
        }

        articles[index] = { ...articles[index], ...updates };
        await this.writeFile(this.articlesFile, articles);
        return articles[index];
    }

    // Save signature
    async saveSignature(signature) {
        const signatures = await this.getSignatures();
        signatures.push(signature);
        await fs.writeFile(
            path.join(this.dataDir, 'signatures.json'),
            JSON.stringify(signatures, null, 2)
        );
    }

    // Get all signatures
    async getSignatures(filters = {}) {
        try {
            const data = await fs.readFile(
                path.join(this.dataDir, 'signatures.json'),
                'utf8'
            );
            let signatures = JSON.parse(data);

            if (filters.signerAddress) {
                signatures = signatures.filter(s => s.signerAddress === filters.signerAddress);
            }
            if (filters.documentHash) {
                signatures = signatures.filter(s => s.documentHash === filters.documentHash);
            }

            return signatures;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    // Get signature by ID
    async getSignature(id) {
        const signatures = await this.getSignatures();
        return signatures.find(s => s.id === id);
    }

    async incrementViews(id) {
        const article = await this.getArticle(id);
        if (article) {
            return await this.updateArticle(id, {
                views: (article.views || 0) + 1
            });
        }
    }
}

export const database = new DatabaseService();