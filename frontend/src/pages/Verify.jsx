import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/apiService';

function Verify() {
    const { id } = useParams();
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        try {
            const result = await apiService.verifyArticle(id);
            setVerification(result);
        } catch (error) {
            console.error('Verification failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '60px 24px', maxWidth: '700px' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <Shield size={64} color="var(--primary)" style={{ marginBottom: '24px' }} />
                <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '16px' }}>
                    Verify Article
                </h1>
                <p style={{ color: 'var(--dark-medium)', fontSize: '16px' }}>
                    Cryptographically verify the authenticity and authorship of this article
                </p>
            </div>

            {!verification ? (
                <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
                    <button
                        className="btn-primary"
                        style={{ padding: '16px 48px', fontSize: '18px' }}
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Start Verification'}
                    </button>
                </div>
            ) : (
                <div>
                    <div className="card" style={{
                        background: verification.valid ? '#E7F5EC' : '#FFEBEE',
                        marginBottom: '24px'
                    }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            {verification.valid ? (
                                <CheckCircle size={32} color="var(--secondary)" />
                            ) : (
                                <AlertCircle size={32} color="var(--primary)" />
                            )}
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
                                    {verification.valid ? 'Verification Successful' : 'Verification Failed'}
                                </h3>
                                <p style={{ color: 'var(--dark-medium)' }}>
                                    {verification.message}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>
                            Verification Details
                        </h4>
                        <VerificationRow label="Ordinal ID" value={verification.ordinalId} />
                        <VerificationRow label="Author" value={verification.author} />
                        <VerificationRow label="Published" value={verification.timestamp} />
                        <VerificationRow label="Signature" value={verification.signature} mono />
                        <VerificationRow label="Block Height" value={verification.blockHeight} />
                    </div>
                </div>
            )}
        </div>
    );
}

function VerificationRow({ label, value, mono }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid var(--border)'
        }}>
            <span style={{ color: 'var(--dark-medium)', fontWeight: 500 }}>
                {label}
            </span>
            <span style={{
                fontFamily: mono ? 'monospace' : 'inherit',
                fontSize: mono ? '13px' : 'inherit'
            }}>
                {value}
            </span>
        </div>
    );
}

export default Verify;