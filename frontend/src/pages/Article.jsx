import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Eye, Share2, Lock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import VerificationBadge from '../components/VerificationBadge';
import { apiService } from '../services/apiService';
import { encryptionService } from '../services/encryptionService';

function Article({ user }) {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [decryptionKey, setDecryptionKey] = useState('');
    const [decrypted, setDecrypted] = useState(false);

    useEffect(() => {
        loadArticle();
    }, [id]);

    const loadArticle = async () => {
        try {
            const data = await apiService.getArticle(id);
            setArticle(data);
            await apiService.incrementViews(id);
        } catch (error) {
            console.error('Failed to load article:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async () => {
        if (!decryptionKey.trim()) {
            alert('Please enter a decryption key');
            return;
        }

        try {
            // Import the key
            const keyBuffer = Uint8Array.from(atob(decryptionKey), c => c.charCodeAt(0));
            const cryptoKey = await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                { name: 'AES-GCM', length: 256 },
                false,
                ['decrypt']
            );

            // The content already has IV + ciphertext combined
            const combined = Uint8Array.from(atob(article.content), c => c.charCodeAt(0));

            // Extract IV (first 12 bytes) and ciphertext+tag (rest)
            const iv = combined.slice(0, 12);
            const ciphertextWithTag = combined.slice(12);

            console.log('Decryption attempt:');
            console.log('Key length:', keyBuffer.length);
            console.log('IV length:', iv.length);
            console.log('Ciphertext+Tag length:', ciphertextWithTag.length);

            // Decrypt
            const decrypted = await crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv,
                    tagLength: 128
                },
                cryptoKey,
                ciphertextWithTag
            );

            // Convert to string
            const decoder = new TextDecoder();
            const decryptedContent = decoder.decode(decrypted);

            setArticle({ ...article, content: decryptedContent });
            setDecrypted(true);
            alert('Content decrypted successfully!');
        } catch (error) {
            console.error('Decryption error:', error);
            alert('Decryption failed: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--dark-medium)' }}>Loading article...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
                <p style={{ color: 'var(--dark-medium)' }}>Article not found</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
            <article>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <VerificationBadge level={article.classification} />
                        {article.encrypted && !decrypted && (
                            <span className="badge" style={{ background: '#FFF4E6', color: '#FF9500' }}>
                                <Lock size={14} />
                                Encrypted
                            </span>
                        )}
                    </div>

                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: 700,
                        lineHeight: 1.2,
                        marginBottom: '24px'
                    }}>
                        {article.title}
                    </h1>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        color: 'var(--dark-medium)',
                        fontSize: '15px',
                        paddingBottom: '24px',
                        borderBottom: '1px solid var(--border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} />
                            {format(new Date(article.publishedAt), 'MMMM dd, yyyy')}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Eye size={16} />
                            {article.views || 0} views
                        </div>
                        <div style={{ color: 'var(--secondary)', fontWeight: 500 }}>
                            By: {article.authorName || 'Anonymous'}
                        </div>
                    </div>
                </div>

                {article.encrypted && !decrypted ? (
                    <div className="card" style={{
                        padding: '40px',
                        textAlign: 'center',
                        background: 'var(--light)'
                    }}>
                        <Lock size={48} color="var(--primary)" style={{ marginBottom: '24px' }} />
                        <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>
                            Encrypted Content
                        </h3>
                        <p style={{
                            color: 'var(--dark-medium)',
                            marginBottom: '32px',
                            maxWidth: '500px',
                            margin: '0 auto 32px'
                        }}>
                            {article.anonymous
                                ? 'This is an anonymous whistleblower document. Enter the decryption key to view the content.'
                                : 'This content is encrypted. Enter the decryption key to view.'}
                        </p>

                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <input
                                type="text"
                                value={decryptionKey}
                                onChange={(e) => setDecryptionKey(e.target.value)}
                                placeholder="Enter decryption key..."
                                style={{ marginBottom: '16px' }}
                            />
                            <button
                                className="btn-primary"
                                style={{ width: '100%' }}
                                onClick={handleDecrypt}
                            >
                                Decrypt Content
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        fontSize: '18px',
                        lineHeight: 1.8,
                        color: 'var(--dark)',
                        fontFamily: 'Georgia, serif'
                    }}>
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index} style={{ marginBottom: '24px' }}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                )}

                <div style={{
                    marginTop: '48px',
                    paddingTop: '32px',
                    borderTop: '1px solid var(--border)'
                }}>
                    <div className="card" style={{ background: '#E7F5EC' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <CheckCircle size={24} color="var(--secondary)" />
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>
                                    Verified on Bitcoin
                                </h4>
                                <p style={{ fontSize: '14px', color: 'var(--dark-medium)', marginBottom: '12px' }}>
                                    This article is permanently inscribed as an ordinal and cannot be altered or removed.
                                </p>
                                <div style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--secondary)' }}>
                                    Ordinal ID: {article.ordinalId || 'ord_' + article.id}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {article.tags && article.tags.length > 0 && (
                    <div style={{ marginTop: '32px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {article.tags.map(tag => (
                                <span
                                    key={tag}
                                    style={{
                                        padding: '6px 12px',
                                        background: 'var(--light)',
                                        borderRadius: '16px',
                                        fontSize: '14px',
                                        color: 'var(--dark-medium)'
                                    }}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}

export default Article;