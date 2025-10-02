import React, { useState } from 'react';
import { X, Upload, Lock } from 'lucide-react';

function PublishModal({ isOpen, onClose, onPublish, user }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        classification: 'public',
        encrypted: false,
        unlockDate: '',
        tags: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onPublish(formData);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 600 }}>Publish Article</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', padding: '8px' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Title
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
                            Content
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Write your article content..."
                            rows="10"
                            required
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Classification
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
                                        Content will be encrypted and require decryption key
                                    </p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontWeight: 500
                                }}>
                                    Unlock Date (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.unlockDate}
                                    onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 500
                        }}>
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="politics, investigation, corruption"
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                        Publish to Bitcoin
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PublishModal;