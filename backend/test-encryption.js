import { encryption } from './src/services/encryption.js';

const testContent = "Bitcoin halving test content";
console.log('Original:', testContent);
console.log('');

const encrypted = encryption.encryptContent(testContent);
console.log('Encrypted (first 50 chars):', encrypted.encrypted.substring(0, 50));
console.log('Key:', encrypted.key);
console.log('IV:', encrypted.iv);
console.log('AuthTag:', encrypted.authTag);
console.log('');

// Test backend decryption
try {
    const decrypted = encryption.decryptContent(
        encrypted.encrypted,
        encrypted.key,
        encrypted.iv,
        encrypted.authTag
    );
    console.log('Backend decrypted:', decrypted);
    console.log('Match:', decrypted === testContent);
} catch (error) {
    console.log('Backend decryption FAILED:', error.message);
}