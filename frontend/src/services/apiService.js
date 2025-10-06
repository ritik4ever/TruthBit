const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class APIService {
    constructor() {
        this.token = null;
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        try {
            const base = (API_BASE || '').replace(/\/+$/, ''); // remove trailing slashes
            let ep = endpoint || '';
            if (!ep.startsWith('/')) ep = '/' + ep;

            // if base already ends with /api and endpoint starts with /api, remove duplicate
            if (base.toLowerCase().endsWith('/api') && ep.startsWith('/api')) {
                ep = ep.replace(/^\/api/, '');
            }

            const url = `${base}${ep}`;
            console.debug('API Request URL:', url, options.method || 'GET');

            const response = await fetch(url, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(error.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    async getArticles(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        return this.request(`/api/content/articles${query ? '?' + query : ''}`);
    }

    async getArticle(id) {
        return this.request(`/api/content/articles/${id}`);
    }

    async getUserArticles(userId) {
        return this.request(`/api/content/articles?author=${userId}`);
    }

    async publishArticle(articleData) {
        return this.request('/api/content/articles', {
            method: 'POST',
            body: JSON.stringify(articleData)
        });
    }

    async incrementViews(id) {
        return this.request(`/api/content/articles/${id}/view`, {
            method: 'POST'
        });
    }

    async verifyArticle(id) {
        return this.request(`/api/verify/${id}`);
    }

    async getIdentity(id) {
        return this.request(`/api/identity/${id}`);
    }

    async signDocument(signatureData) {
        return this.request('/api/signatures/sign', {
            method: 'POST',
            body: JSON.stringify(signatureData)
        });
    }

    async verifySignature(documentHash) {
        return this.request('/api/signatures/verify', {
            method: 'POST',
            body: JSON.stringify({ documentHash })
        });
    }
}

export const apiService = new APIService();
