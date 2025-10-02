import React from 'react';
import { Lock, Copy, Download, X } from 'lucide-react';

function KeySaveModal({ decryptionKey, onClose, onNavigate }) {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const downloadKey = () => {
        const blob = new Blob([decryptionKey], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `truthbit-decryption-key-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        padding: '8px'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <Lock size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px', color: 'var(--dark)' }}>
                        Save Your Decryption Key
                    </h2>
                    <p style={{ color: 'var(--dark-medium)', fontSize: '15px' }}>
                        This key is required to decrypt the content. It cannot be recovered if lost!
                    </p>
                </div>

                <div style={{
                    background: '#FFF4E6',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    border: '2px dashed #FF9500'
                }}>
                    <p style={{ fontSize: '12px', color: '#FF9500', fontWeight: 600, marginBottom: '8px' }}>
                        DECRYPTION KEY:
                    </p>
                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        wordBreak: 'break-all',
                        background: 'white',
                        padding: '12px',
                        borderRadius: '4px',
                        color: 'var(--dark)'
                    }}>
                        {decryptionKey}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <button
                        className="btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => copyToClipboard(decryptionKey)}
                    >
                        <Copy size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Copy Key
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ flex: 1 }}
                        onClick={downloadKey}
                    >
                        <Download size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Download Key
                    </button>
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => {
                        onClose();
                        onNavigate();
                    }}
                >
                    I've Saved the Key - Continue
                </button>

                <p style={{
                    marginTop: '16px',
                    fontSize: '13px',
                    color: 'var(--dark-medium)',
                    textAlign: 'center'
                }}>
                    Store this key securely. You'll need it to decrypt the article.
                </p>
            </div>
        </div>
    );
}

export default KeySaveModal;