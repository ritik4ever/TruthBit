import React from 'react';
import { Lock } from 'lucide-react';

function Privacy() {
    return (
        <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '48px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <Lock size={32} color="var(--primary)" />
                    <h1 style={{ fontSize: '36px', fontWeight: 700, margin: 0 }}>
                        Privacy Policy
                    </h1>
                </div>
                <p style={{ color: 'var(--dark-medium)' }}>
                    Last updated: October 1, 2025
                </p>
            </div>

            <div style={{ lineHeight: 1.8, color: 'var(--dark)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    1. Information We Collect
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit is designed with privacy in mind. We collect minimal information:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li><strong>Wallet Address:</strong> Your public wallet address when you connect</li>
                    <li><strong>Published Content:</strong> Articles and metadata you choose to publish</li>
                    <li><strong>Usage Data:</strong> Anonymous analytics about platform usage</li>
                </ul>
                <p style={{ marginBottom: '16px' }}>
                    We do NOT collect: email addresses, personal identification, browsing history,
                    or any data beyond what's necessary for the service to function.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    2. How We Use Information
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    Information we collect is used to:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>Provide and improve the TruthBit service</li>
                    <li>Display your published content and identity</li>
                    <li>Process Bitcoin inscriptions</li>
                    <li>Analyze platform usage for improvements</li>
                </ul>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    3. Data Storage
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    <strong>On-Chain Data:</strong> Content published to Bitcoin ordinals is permanently
                    stored on the Bitcoin blockchain. This is public, immutable, and outside our control.
                </p>
                <p style={{ marginBottom: '16px' }}>
                    <strong>Off-Chain Data:</strong> Minimal metadata and cache data may be stored on
                    our servers temporarily for performance. This data can be deleted upon request.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    4. Encryption and Security
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We use industry-standard encryption (AES-256-GCM) for whistleblower content.
                    Encryption occurs client-side before data leaves your device. We cannot access
                    encrypted content without your decryption key.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    5. Third-Party Services
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit integrates with:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li><strong>Wallet Providers:</strong> MetaMask, WalletConnect (privacy policies apply)</li>
                    <li><strong>Bitcoin Network:</strong> Public blockchain (all transactions are public)</li>
                    <li><strong>Analytics:</strong> Anonymous usage statistics (no personal data)</li>
                </ul>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    6. Anonymity for Whistleblowers
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    While TruthBit provides technical tools for anonymous publishing, true anonymity
                    requires operational security on your part:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>Use Tor or VPN for IP address protection</li>
                    <li>Use dedicated anonymous wallets</li>
                    <li>Avoid including identifying information in content</li>
                    <li>Be aware of metadata in uploaded files</li>
                </ul>
                <p style={{ marginBottom: '16px' }}>
                    We cannot guarantee anonymity and recommend consulting security experts for
                    high-risk submissions.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    7. Data Sharing
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We do NOT sell, rent, or share your personal information with third parties
                    except:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>When required by law or legal process</li>
                    <li>To prevent fraud or security threats</li>
                    <li>With your explicit consent</li>
                </ul>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    8. Your Rights
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    You have the right to:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>Access data we store about you</li>
                    <li>Request deletion of off-chain data</li>
                    <li>Opt out of analytics tracking</li>
                    <li>Export your published content metadata</li>
                </ul>
                <p style={{ marginBottom: '16px' }}>
                    Note: On-chain Bitcoin data cannot be deleted due to blockchain immutability.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    9. Cookies and Tracking
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We use minimal cookies for:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>Maintaining your session</li>
                    <li>Remembering wallet connection</li>
                    <li>Anonymous usage analytics</li>
                </ul>
                <p style={{ marginBottom: '16px' }}>
                    You can disable cookies in your browser, but some features may not work properly.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    10. Children's Privacy
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit is not intended for users under 18 years old. We do not knowingly
                    collect information from children.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    11. International Users
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit is accessible globally. Bitcoin blockchain data is distributed
                    internationally. By using the service, you consent to international data transfer.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    12. Changes to Privacy Policy
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We may update this privacy policy. Continued use after changes constitutes
                    acceptance. Material changes will be prominently announced.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    13. Contact Us
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    For privacy concerns or data requests, contact us through our support channels.
                </p>
            </div>
        </div>
    );
}

export default Privacy;