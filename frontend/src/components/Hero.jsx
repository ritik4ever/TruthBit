import React from 'react';
import { Shield, Lock, Globe } from 'lucide-react';

function Hero({ isConnected }) {
    return (
        <div style={{
            background: 'white',
            color: 'var(--dark)',
            padding: '80px 0',
            textAlign: 'center',
            borderBottom: '1px solid var(--border)'
        }}>
            <div className="container">
                <h1 style={{
                    fontSize: '56px',
                    fontWeight: 700,
                    marginBottom: '24px',
                    lineHeight: 1.2,
                    color: 'var(--dark)'
                }}>
                    Censorship-Proof Publishing
                </h1>
                <p style={{
                    fontSize: '20px',
                    marginBottom: '40px',
                    color: 'var(--dark-medium)',
                    maxWidth: '700px',
                    margin: '0 auto 40px'
                }}>
                    Publish verified journalism and whistleblower documents on Bitcoin.
                    Immutable, decentralized, and impossible to censor.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '32px',
                    marginTop: '80px',
                    maxWidth: '900px',
                    margin: '80px auto 0'
                }}>
                    <Feature
                        icon={<Shield size={32} />}
                        title="Verified Identity"
                        description="Cryptographic proof of authorship"
                    />
                    <Feature
                        icon={<Lock size={32} />}
                        title="Encrypted Content"
                        description="Time-locked whistleblower protection"
                    />
                    <Feature
                        icon={<Globe size={32} />}
                        title="Permanent Archive"
                        description="Stored on Bitcoin forever"
                    />
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title, description }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                marginBottom: '16px',
                color: 'var(--primary)'
            }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '8px',
                color: 'var(--dark)'
            }}>
                {title}
            </h3>
            <p style={{
                fontSize: '14px',
                color: 'var(--dark-medium)'
            }}>
                {description}
            </p>
        </div>
    );
}

export default Hero;