import React from 'react';
import { User, CheckCircle, Shield } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

function IdentityCard({ identity, onClick }) {
    return (
        <div
            className="card"
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <User size={32} />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600 }}>
                            {identity.name || 'Anonymous'}
                        </h3>
                        <VerificationBadge level={identity.verificationLevel} />
                    </div>

                    <p style={{
                        color: 'var(--dark-medium)',
                        fontSize: '14px',
                        marginBottom: '12px'
                    }}>
                        {identity.credentialType}
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        fontSize: '13px',
                        color: 'var(--dark-medium)'
                    }}>
                        <span>
                            <Shield size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            {identity.articlesPublished || 0} articles
                        </span>
                        <span style={{
                            color: 'var(--secondary)',
                            fontWeight: 500
                        }}>
                            Ordinal: {identity.ordinalId?.slice(0, 8)}...
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IdentityCard;