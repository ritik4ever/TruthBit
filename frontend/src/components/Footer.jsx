import React from 'react';
import { Shield, Github, Twitter } from 'lucide-react';

function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--border)',
            padding: '40px 0',
            marginTop: '80px',
            background: 'var(--light)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px'
                }}>
                    <div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '16px'
                        }}>
                            <Shield size={24} color="var(--primary)" />
                            <span style={{ fontSize: '20px', fontWeight: 700 }}>
                                TruthVault
                            </span>
                        </div>
                        <p style={{ color: 'var(--dark-medium)', fontSize: '14px' }}>
                            Censorship-proof publishing platform built on Bitcoin ordinals.
                            Protecting free speech and verified journalism.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>Legal</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <FooterLink href="/terms">Terms of Use</FooterLink>
                            <FooterLink href="/privacy">Privacy Policy</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>Resources</h4>
                        <ul style={{ listStyle: 'none' }}>
                            <FooterLink href="#">Documentation</FooterLink>
                            <FooterLink href="#">API Reference</FooterLink>
                            <FooterLink href="#">How It Works</FooterLink>
                            <FooterLink href="#">FAQ</FooterLink>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>Community</h4>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <a href="#" style={{ color: 'var(--dark)' }}>
                                <Github size={24} />
                            </a>
                            <a href="#" style={{ color: 'var(--dark)' }}>
                                <Twitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '40px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border)',
                    textAlign: 'center',
                    color: 'var(--dark-medium)',
                    fontSize: '14px'
                }}>
                    © 2025 TruthBit. Built on Bitcoin. Open source and decentralized.
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <li style={{ marginBottom: '8px' }}>
            <a
                href={href}
                style={{
                    color: 'var(--dark-medium)',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--dark-medium)'}
            >
                {children}
            </a>
        </li>
    );
}

export default Footer;