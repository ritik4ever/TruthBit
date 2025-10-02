import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogOut, FileText } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Header({ user, onLogout }) {
    return (
        <header style={{
            borderBottom: '1px solid var(--border)',
            padding: '16px 0',
            background: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Link to="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textDecoration: 'none',
                    color: 'var(--dark)'
                }}>
                    <Shield size={32} color="var(--primary)" strokeWidth={2.5} />
                    <span style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        letterSpacing: '-0.5px'
                    }}>
                        TruthBit
                    </span>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {user ? (
                        <>
                            <Link to="/dashboard" style={{
                                textDecoration: 'none',
                                color: 'var(--dark-medium)',
                                fontWeight: 500
                            }}>
                                Dashboard
                            </Link>
                            <Link to="/publish">
                                <button className="btn-primary">
                                    <FileText size={18} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                                    Publish
                                </button>
                            </Link>
                        </>
                    ) : null}
                    <ConnectButton />
                </nav>
            </div>
        </header>
    );
}

export default Header;