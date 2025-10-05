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
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers
            });

            if (!response.ok) {
                const error = await response.json();
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
}

export const apiService = new APIService();