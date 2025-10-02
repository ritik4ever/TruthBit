import crypto from 'crypto';

class EncryptionService {
    constructor() {
        this.algorithm = 'aes-256-gcm';
        this.keyLength = 32; // 256 bits
        this.ivLength = 12; // 96 bits for GCM
        this.saltLength = 64;
        this.tagLength = 16; // 128 bits auth tag
    }

    // Encrypt content with AES-256-GCM
    encryptContent(content) {
        try {
            const key = crypto.randomBytes(this.keyLength);
            const iv = crypto.randomBytes(this.ivLength);
            const cipher = crypto.createCipheriv(this.algorithm, key, iv);

            const encrypted = Buffer.concat([
                cipher.update(content, 'utf8'),
                cipher.final()
            ]);

            const authTag = cipher.getAuthTag();

            // Combine: IV + encrypted + authTag (for Web Crypto compatibility)
            const combined = Buffer.concat([iv, encrypted, authTag]);

            return {
                encrypted: combined.toString('base64'),
                key: key.toString('base64'),
                iv: iv.toString('base64'),
                authTag: authTag.toString('base64'),
                algorithm: this.algorithm
            };
        } catch (error) {
            console.error('Encryption failed:', error);
            throw new Error('Failed to encrypt content');
        }
    }

    // Decrypt content with AES-256-GCM
    decryptContent(encryptedData, keyBase64, ivBase64, authTagBase64) {
        try {
            const key = Buffer.from(keyBase64, 'base64');
            const combined = Buffer.from(encryptedData, 'base64');

            // Extract: IV (12) + ciphertext + authTag (16)
            const iv = combined.slice(0, 12);
            const authTag = combined.slice(-16);
            const ciphertext = combined.slice(12, -16);

            const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(ciphertext, null, 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            console.error('Decryption failed:', error);
            throw new Error('Invalid decryption key or corrupted data');
        }
    }

    // Derive key from password using PBKDF2
    deriveKey(password, salt) {
        return crypto.pbkdf2Sync(
            password,
            salt,
            100000,
            this.keyLength,
            'sha256'
        );
    }

    // Time-lock encryption
    createTimeLock(content, unlockDate) {
        try {
            const timeSeed = new Date(unlockDate).getTime().toString();
            const salt = crypto.randomBytes(this.saltLength);
            const key = this.deriveKey(timeSeed, salt);
            const iv = crypto.randomBytes(this.ivLength);

            const cipher = crypto.createCipheriv(this.algorithm, key, iv);
            const encrypted = Buffer.concat([
                cipher.update(content, 'utf8'),
                cipher.final()
            ]);
            const authTag = cipher.getAuthTag();
            const combined = Buffer.concat([iv, encrypted, authTag]);

            return {
                encrypted: combined.toString('base64'),
                unlockDate,
                salt: salt.toString('base64'),
                iv: iv.toString('base64'),
                authTag: authTag.toString('base64'),
                timeLocked: true
            };
        } catch (error) {
            console.error('Time-lock encryption failed:', error);
            throw new Error('Failed to create time-lock');
        }
    }

    // Unlock time-locked content
    unlockTimeLock(encryptedData, unlockDate, saltBase64, ivBase64, authTagBase64) {
        if (new Date() < new Date(unlockDate)) {
            throw new Error('Time-lock has not expired yet');
        }

        const timeSeed = new Date(unlockDate).getTime().toString();
        const salt = Buffer.from(saltBase64, 'base64');
        const key = this.deriveKey(timeSeed, salt);

        return this.decryptContent(encryptedData, key.toString('base64'), ivBase64, authTagBase64);
    }

    generateKey() {
        return crypto.randomBytes(this.keyLength).toString('base64');
    }

    hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    createHMAC(message, key) {
        return crypto.createHmac('sha256', key).update(message).digest('hex');
    }

    verifyHMAC(message, hmac, key) {
        const computed = this.createHMAC(message, key);
        return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(computed));
    }
}

export const encryption = new EncryptionService();