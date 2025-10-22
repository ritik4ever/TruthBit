import React from 'react';
import { Shield } from 'lucide-react';

function Terms() {
    return (
        <div className="container" style={{ padding: '60px 24px', maxWidth: '800px' }}>
            <div style={{ marginBottom: '48px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '24px'
                }}>
                    <Shield size={32} color="var(--primary)" />
                    <h1 style={{ fontSize: '36px', fontWeight: 700, margin: 0 }}>
                        Terms of Use
                    </h1>
                </div>
                <p style={{ color: 'var(--dark-medium)' }}>
                    Last updated: October 1, 2025
                </p>
            </div>

            <div style={{ lineHeight: 1.8, color: 'var(--dark)' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    1. Acceptance of Terms
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    By accessing and using TruthBit, you accept and agree to be bound by the terms and
                    provision of this agreement. If you do not agree to abide by these terms, please do
                    not use this service.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    2. Description of Service
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit is a decentralized publishing platform that enables users to create
                    censorship-proof content stored on Bitcoin ordinals. The service includes:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>Publishing verified journalism articles</li>
                    <li>Creating sovereign digital identities</li>
                    <li>Encrypted whistleblower document submission</li>
                    <li>Cryptographic verification of content authenticity</li>
                </ul>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    3. User Responsibilities
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    You agree to:
                </p>
                <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>
                    <li>Provide accurate information when creating identity credentials</li>
                    <li>Maintain the security of your private keys and wallet</li>
                    <li>Not use the service for illegal activities</li>
                    <li>Not publish content that violates others' rights</li>
                    <li>Comply with applicable laws and regulations</li>
                </ul>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    4. Content Permanence
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    Content published to Bitcoin ordinals is permanent and immutable. Once inscribed,
                    content cannot be deleted, modified, or removed. You are solely responsible for
                    any content you publish.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    5. Fees and Payments
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    Bitcoin inscription fees are required for publishing content on-chain. These fees
                    are paid directly to Bitcoin miners and are non-refundable. TruthBit does not
                    control or profit from these fees.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    6. Intellectual Property
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    You retain all rights to content you publish. By publishing content, you grant
                    TruthBit a license to display and distribute your content through the platform.
                    You represent that you have the necessary rights to publish the content.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    7. Encryption and Security
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    Encrypted content uses AES-256-GCM encryption. You are responsible for securely
                    storing decryption keys. Lost keys cannot be recovered, and encrypted content
                    will become permanently inaccessible.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    8. Whistleblower Protection
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    While TruthBit provides technical tools for anonymous publishing, users are
                    responsible for their own operational security. We cannot guarantee anonymity
                    and recommend consulting legal counsel before publishing sensitive information.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    9. Disclaimers
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit is provided "as is" without warranties of any kind. We do not guarantee
                    uninterrupted service, error-free operation, or that the service meets your
                    specific requirements.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    10. Limitation of Liability
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    TruthBit shall not be liable for any indirect, incidental, special, consequential,
                    or punitive damages resulting from your use of the service.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    11. Termination
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We reserve the right to terminate or suspend access to the service for violations
                    of these terms. Published content on Bitcoin will remain permanently accessible
                    even after account termination.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    12. Changes to Terms
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    We may modify these terms at any time. Continued use of the service after changes
                    constitutes acceptance of the modified terms.
                </p>

                <h2 style={{ fontSize: '24px', fontWeight: 600, marginTop: '32px', marginBottom: '16px' }}>
                    13. Contact
                </h2>
                <p style={{ marginBottom: '16px' }}>
                    For questions about these terms, contact us through our support channels.
                </p>
            </div>
        </div>
    );
}

export default Terms;