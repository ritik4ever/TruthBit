class EncryptionService {
    constructor() {
        this.algorithm = 'AES-GCM';
        this.keyLength = 256;
    }

    // Generate a secure random key
    async generateKey() {
        const key = await crypto.subtle.generateKey(
            {
                name: this.algorithm,
                length: this.keyLength
            },
            true,
            ['encrypt', 'decrypt']
        );
        return key;
    }

    // Export key to raw format
    async exportKey(key) {
        const exported = await crypto.subtle.exportKey('raw', key);
        return this.arrayBufferToBase64(exported);
    }

    // Import key from raw format
    async importKey(keyString) {
        const keyBuffer = this.base64ToArrayBuffer(keyString);
        return await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            {
                name: this.algorithm,
                length: this.keyLength
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    // Encrypt content with AES-256-GCM
    async encrypt(content, key = null) {
        try {
            // Generate key if not provided
            const encryptionKey = key || await this.generateKey();

            // Generate random IV (12 bytes for GCM)
            const iv = crypto.getRandomValues(new Uint8Array(12));

            // Convert content to ArrayBuffer
            const encoder = new TextEncoder();
            const data = encoder.encode(content);

            // Encrypt
            const encrypted = await crypto.subtle.encrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                encryptionKey,
                data
            );

            // Combine IV and encrypted data
            const combined = new Uint8Array(iv.length + encrypted.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(encrypted), iv.length);

            // Export key
            const exportedKey = await this.exportKey(encryptionKey);

            return {
                encrypted: this.arrayBufferToBase64(combined),
                key: exportedKey,
                algorithm: this.algorithm
            };
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt content');
        }
    }

    // Decrypt content with AES-256-GCM
    async decrypt(encryptedData, keyString) {
        try {
            // Import key
            const key = await this.importKey(keyString);

            // Decode encrypted data
            const combined = this.base64ToArrayBuffer(encryptedData);

            // Extract IV and ciphertext
            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);

            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                key,
                ciphertext
            );

            // Convert back to string
            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Invalid decryption key or corrupted data');
        }
    }

    // Generate key from password (for time-lock encryption)
    async deriveKeyFromPassword(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        const baseKey = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        return await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            baseKey,
            {
                name: this.algorithm,
                length: this.keyLength
            },
            true,
            ['encrypt', 'decrypt']
        );
    }

    // Time-lock encryption (simple implementation)
    async timeLockEncrypt(content, unlockDate) {
        // Generate time-based seed
        const timeSeed = new Date(unlockDate).getTime().toString();
        const salt = crypto.getRandomValues(new Uint8Array(16));

        // Derive key from time seed
        const key = await this.deriveKeyFromPassword(timeSeed, salt);

        // Encrypt with derived key
        const encrypted = await this.encrypt(content, key);

        return {
            ...encrypted,
            unlockDate: unlockDate,
            salt: this.arrayBufferToBase64(salt),
            timeLocked: true
        };
    }

    // Verify if time-lock can be opened
    canUnlockTimeLock(unlockDate) {
        return new Date() >= new Date(unlockDate);
    }

    // Utility: ArrayBuffer to Base64
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Utility: Base64 to ArrayBuffer
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    // Hash data with SHA-256
    async hash(data) {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        return this.arrayBufferToBase64(hashBuffer);
    }

    // Generate secure random string
    generateSecureRandom(length = 32) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}

export const encryptionService = new EncryptionService();