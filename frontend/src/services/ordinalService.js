import { apiService } from './apiService.js';

class OrdinalService {
    constructor() {
        this.maxInscriptionSize = 350000; // 350KB limit
    }

    // Inscribe content to Bitcoin
    async inscribeContent(data, metadata = {}) {
        try {
            const contentString = typeof data === 'string' ? data : JSON.stringify(data);
            const contentSize = new Blob([contentString]).size;

            // Check if content needs stitching
            if (contentSize > this.maxInscriptionSize) {
                return await this.inscribeWithStitch(contentString, metadata);
            }

            // Single inscription
            return await apiService.inscribeContent({
                content: contentString,
                metadata: {
                    ...metadata,
                    size: contentSize,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
            console.error('Inscription failed:', error);
            throw new Error('Failed to inscribe content to Bitcoin');
        }
    }

    // Inscribe large content using Open Ordinal Stitch
    async inscribeWithStitch(content, metadata = {}) {
        try {
            // Split content into chunks
            const chunks = this.splitContent(content, this.maxInscriptionSize);

            console.log(`Content requires ${chunks.length} inscriptions`);

            // Inscribe each chunk
            const partInscriptions = [];
            for (let i = 0; i < chunks.length; i++) {
                const part = await apiService.inscribeContent({
                    content: chunks[i],
                    metadata: {
                        ...metadata,
                        part: i,
                        totalParts: chunks.length,
                        timestamp: new Date().toISOString()
                    }
                });
                partInscriptions.push(part.inscriptionId);
            }

            // Create parent inscription with stitch metadata
            const parentInscription = await apiService.inscribeContent({
                metadata: {
                    ...metadata,
                    stitch: {
                        parts: partInscriptions,
                        contentType: 'application/json',
                        totalSize: content.length
                    },
                    timestamp: new Date().toISOString()
                }
            });

            return {
                ...parentInscription,
                parts: partInscriptions,
                stitched: true
            };
        } catch (error) {
            console.error('Stitch inscription failed:', error);
            throw new Error('Failed to inscribe large content');
        }
    }

    // Split content into manageable chunks
    splitContent(content, chunkSize) {
        const chunks = [];
        for (let i = 0; i < content.length; i += chunkSize) {
            chunks.push(content.substring(i, i + chunkSize));
        }
        return chunks;
    }

    // Fetch and reconstruct stitched content
    async fetchStitchedContent(parentId) {
        try {
            const parent = await apiService.getOrdinalData(parentId);

            if (!parent.metadata?.stitch) {
                throw new Error('Not a stitched inscription');
            }

            const { parts } = parent.metadata.stitch;

            // Fetch all parts
            const partContents = await Promise.all(
                parts.map(partId => apiService.getOrdinalData(partId))
            );

            // Reconstruct content
            return partContents.map(p => p.content).join('');
        } catch (error) {
            console.error('Failed to fetch stitched content:', error);
            throw error;
        }
    }

    // Create identity ordinal
    async createIdentityOrdinal(identityData) {
        const metadata = {
            type: 'identity',
            protocol: 'truthvault-identity-v1',
            identity: {
                credentialType: identityData.credentialType,
                verificationLevel: identityData.verificationLevel,
                publicKey: identityData.publicKey,
                name: identityData.name
            }
        };

        return await this.inscribeContent(metadata);
    }

    // Create article ordinal
    async createArticleOrdinal(articleData) {
        const metadata = {
            type: 'article',
            protocol: 'truthvault-article-v1',
            content: {
                title: articleData.title,
                excerpt: articleData.excerpt,
                classification: articleData.classification,
                encrypted: articleData.encrypted || false,
                author: articleData.authorId,
                tags: articleData.tags,
                publishedAt: articleData.publishedAt
            }
        };

        // Include full content
        const fullData = {
            metadata,
            content: articleData.content
        };

        return await this.inscribeContent(fullData, metadata);
    }

    // Estimate inscription fee
    estimateFee(contentSize) {
        const satsPerByte = 10; // Adjust based on network conditions
        const baseSize = contentSize;
        const overheadSize = 500; // Approximate overhead
        return (baseSize + overheadSize) * satsPerByte;
    }

    // Validate ordinal ID format
    validateOrdinalId(id) {
        // Bitcoin ordinal format: txid + 'i' + output_index
        const pattern = /^[a-f0-9]{64}i\d+$/;
        return pattern.test(id);
    }
}

export const ordinalService = new OrdinalService();