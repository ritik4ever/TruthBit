import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, UserX, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import KeySaveModal from '../components/KeySaveModal';

function Publish({ user }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [decryptionKey, setDecryptionKey] = useState(null);
    const [showKeyModal, setShowKeyModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        classification: 'public',
        encrypted: false,
        unlockDate: '',
        tags: '',
        coverImage: '',
        anonymous: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const articleData = {
                ...formData,
                authorId: user.id,
                authorName: user.name,
                publishedAt: new Date().toISOString(),
                views: 0,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            const published = await apiService.publishArticle(articleData);

            if (published.anonymous) {
                localStorage.setItem(`my_article_${published.id}`, 'true');
            }

            if (published.decryptionKey) {
                setDecryptionKey(published.decryptionKey);
                setShowKeyModal(true);
            } else {
                alert('Article published successfully to Bitcoin!');
                navigate(`/article/${published.id}`);
            }
        } catch (error) {
            console.error('Failed to publish:', error);
            alert('Failed to publish article: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (showKeyModal && decryptionKey) {
        return (
            <KeySaveModal
                decryptionKey={decryptionKey}
                onClose={() => setShowKeyModal(false)}
                onNavigate={() => navigate('/dashboard')}
            />
        );
    }

    return (
        <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
                    Publish Article
                </h1>
                <p style={{ color: 'var(--dark-medium)', fontSize: '16px' }}>
                    Your content will be permanently inscribed on Bitcoin
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Anonymous Mode Toggle */}
                <div className="card" style={{
                    marginBottom: '24px',
                    background: formData.anonymous ? '#FFF4E6' : 'white',
                    border: formData.anonymous ? '2px solid #FF9500' : 'none'
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={(e) => setFormData({
                                ...formData,
                                anonymous: e.target.checked,
                                classification: e.target.checked ? 'whistleblower' : 'public'
                            })}
                            style={{ width: 'auto', cursor: 'pointer' }}
                        />
                        <UserX size={24} color={formData.anonymous ? '#FF9500' : 'var(--dark-medium)'} />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, marginBottom: '4px' }}>
                                Publish Anonymously
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--dark-medium)' }}>
                                Your identity will be hidden. Content will be encrypted for whistleblower protection.
                            </p>
                        </div>
                    </label>
                </div>

                <div className="card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                        Article Information
                    </h3>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter article title..."
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Excerpt
                        </label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Brief summary (will be shown in preview)..."
                            rows="3"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Content *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your article content..."
                            rows="15"
                            required
                            style={{ resize: 'vertical', fontFamily: 'Georgia, serif' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Tags
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="politics, investigation, corruption"
                        />
                    </div>
                </div>

                {!formData.anonymous && (
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                            Classification & Security
                        </h3>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: 500
                            }}>
                                Classification *
                            </label>
                            <select
                                value={formData.classification}
                                onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                            >
                                <option value="public">Public Article</option>
                                <option value="authenticated">Authenticated Only</option>
                                <option value="whistleblower">Whistleblower Drop</option>
                            </select>
                        </div>

                        {formData.classification === 'whistleblower' && (
                            <>
                                <div style={{
                                    marginBottom: '20px',
                                    padding: '16px',
                                    background: '#FFF4E6',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    gap: '12px'
                                }}>
                                    <Lock size={20} color="#FF9500" />
                                    <div>
                                        <p style={{ fontWeight: 500, marginBottom: '4px' }}>
                                            Encryption Enabled
                                        </p>
                                        <p style={{ fontSize: '14px', color: 'var(--dark-medium)' }}>
                                            Content will be encrypted using AES-256.
                                            {formData.unlockDate ? ' Auto-unlock at specified time.' : ' Save the decryption key.'}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: 500
                                    }}>
                                        Time-Lock Release Date (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.unlockDate}
                                        onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                    <p style={{
                                        fontSize: '13px',
                                        color: 'var(--dark-medium)',
                                        marginTop: '6px'
                                    }}>
                                        Content will automatically decrypt at this time. Leave empty for manual decryption.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {formData.anonymous && (
                    <div className="card" style={{ marginBottom: '24px', background: '#FFF4E6', border: '1px solid #FF9500' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <AlertCircle size={24} color="#FF9500" />
                            <div>
                                <h4 style={{ fontWeight: 600, marginBottom: '8px', color: '#FF9500' }}>
                                    Anonymous Whistleblower Mode
                                </h4>
                                <ul style={{ fontSize: '14px', color: 'var(--dark-medium)', marginLeft: '20px' }}>
                                    <li>Your identity will not be revealed</li>
                                    <li>Content will be automatically encrypted</li>
                                    <li>You'll receive a decryption key - save it securely</li>
                                    <li>Article will be marked as "Anonymous" on blockchain</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', padding: '16px' }}
                    disabled={loading}
                >
                    {loading ? 'Publishing to Bitcoin...' : formData.anonymous ? 'Publish Anonymously' : 'Publish Article'}
                </button>
            </form>
        </div>
    );
}

export default Publish;