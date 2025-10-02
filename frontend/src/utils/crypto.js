class CryptoUtils {
    // Generate ECDSA key pair for signing
    async generateKeyPair() {
        try {
            const keyPair = await crypto.subtle.generateKey(
                {
                    name: 'ECDSA',
                    namedCurve: 'P-256'
                },
                true,
                ['sign', 'verify']
            );

            const publicKey = await this.exportPublicKey(keyPair.publicKey);
            const privateKey = await this.exportPrivateKey(keyPair.privateKey);

            return { publicKey, privateKey, keyPair };
        } catch (error) {
            console.error('Key generation failed:', error);
            throw new Error('Failed to generate key pair');
        }
    }

    // Export public key
    async exportPublicKey(key) {
        const exported = await crypto.subtle.exportKey('spki', key);
        return this.arrayBufferToHex(exported);
    }

    // Export private key
    async exportPrivateKey(key) {
        const exported = await crypto.subtle.exportKey('pkcs8', key);
        return this.arrayBufferToHex(exported);
    }

    // Import public key
    async importPublicKey(keyHex) {
        const keyBuffer = this.hexToArrayBuffer(keyHex);
        return await crypto.subtle.importKey(
            'spki',
            keyBuffer,
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['verify']
        );
    }

    // Import private key
    async importPrivateKey(keyHex) {
        const keyBuffer = this.hexToArrayBuffer(keyHex);
        return await crypto.subtle.importKey(
            'pkcs8',
            keyBuffer,
            {
                name: 'ECDSA',
                namedCurve: 'P-256'
            },
            true,
            ['sign']
        );
    }

    // Sign message
    async sign(message, privateKeyHex) {
        try {
            const privateKey = await this.importPrivateKey(privateKeyHex);
            const encoder = new TextEncoder();
            const data = encoder.encode(message);

            const signature = await crypto.subtle.sign(
                {
                    name: 'ECDSA',
                    hash: { name: 'SHA-256' }
                },
                privateKey,
                data
            );

            return this.arrayBufferToHex(signature);
        } catch (error) {
            console.error('Signing failed:', error);
            throw new Error('Failed to sign message');
        }
    }

    // Verify signature
    async verify(message, signatureHex, publicKeyHex) {
        try {
            const publicKey = await this.importPublicKey(publicKeyHex);
            const encoder = new TextEncoder();
            const data = encoder.encode(message);
            const signature = this.hexToArrayBuffer(signatureHex);

            return await crypto.subtle.verify(
                {
                    name: 'ECDSA',
                    hash: { name: 'SHA-256' }
                },
                publicKey,
                signature,
                data
            );
        } catch (error) {
            console.error('Verification failed:', error);
            return false;
        }
    }

    // Hash data with SHA-256
    async hash(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        return this.arrayBufferToHex(hashBuffer);
    }

    // Utility: ArrayBuffer to Hex
    arrayBufferToHex(buffer) {
        const bytes = new Uint8Array(buffer);
        return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Utility: Hex to ArrayBuffer
    hexToArrayBuffer(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    // Generate secure random bytes
    getRandomBytes(length) {
        return crypto.getRandomValues(new Uint8Array(length));
    }

    // Generate secure random hex string
    getRandomHex(length) {
        const bytes = this.getRandomBytes(length);
        return this.arrayBufferToHex(bytes);
    }
}

export const cryptoUtils = new CryptoUtils();