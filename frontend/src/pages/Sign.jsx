import React, { useState } from 'react';
import { FileText, Lock, CheckCircle, Upload } from 'lucide-react';
import { useAccount, useSignMessage } from 'wagmi';

function Sign({ user }) {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [file, setFile] = useState(null);
    const [documentHash, setDocumentHash] = useState('');
    const [signing, setSigning] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileUpload = async (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);

        // Hash the file
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        setDocumentHash(hash);
    };

    const handleSign = async () => {
        if (!documentHash || !address) return;

        setSigning(true);
        try {
            // Sign the document hash with wallet
            const message = `I am signing document with hash: ${documentHash}`;
            const signature = await signMessageAsync({ message });

            // Submit to backend to inscribe on Bitcoin
            const response = await fetch('http://localhost:5000/api/signatures/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    documentHash,
                    documentName: file.name, // Add document name
                    signerName: user.name,
                    signerAddress: address,
                    signature
                })
            });

            const data = await response.json();
            setResult(data);
            alert('Document signed and inscribed on Bitcoin!');
        } catch (error) {
            console.error('Signing failed:', error);
            alert('Failed to sign document');
        } finally {
            setSigning(false);
        }
    };

    return (
        <div className="container" style={{ padding: '40px 24px', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '12px' }}>
                Sign Document
            </h1>
            <p style={{ color: 'var(--dark-medium)', marginBottom: '40px' }}>
                Cryptographically sign documents and inscribe proof on Bitcoin
            </p>

            <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>
                    Upload Document
                </h3>

                <div style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '8px',
                    padding: '40px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <Upload size={48} color="var(--dark-medium)" style={{ marginBottom: '16px' }} />
                    <p style={{ marginBottom: '16px', color: 'var(--dark-medium)' }}>
                        Upload any document (PDF, TXT, DOCX, etc.)
                    </p>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="btn-secondary" style={{ cursor: 'pointer' }}>
                        Choose File
                    </label>
                </div>

                {file && (
                    <div style={{
                        background: 'var(--light)',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: '8px' }}>File Selected:</p>
                        <p style={{ fontSize: '14px', marginBottom: '12px' }}>{file.name}</p>
                        <p style={{ fontWeight: 600, marginBottom: '8px' }}>SHA-256 Hash:</p>
                        <p style={{
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            wordBreak: 'break-all',
                            color: 'var(--dark-medium)'
                        }}>
                            {documentHash}
                        </p>
                    </div>
                )}

                <button
                    className="btn-primary"
                    style={{ width: '100%' }}
                    onClick={handleSign}
                    disabled={!documentHash || signing}
                >
                    {signing ? 'Signing & Inscribing...' : 'Sign Document'}
                </button>
            </div>

            {result && (
                <div className="card" style={{ background: '#E7F5EC' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <CheckCircle size={24} color="var(--secondary)" />
                        <div>
                            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>
                                Document Signed Successfully
                            </h4>
                            <p style={{ fontSize: '14px', color: 'var(--dark-medium)', marginBottom: '12px' }}>
                                Signature inscribed on Bitcoin permanently
                            </p>
                            <p style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                                Inscription ID: {result.inscriptionId}
                            </p>
                            <p style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                                TXID: {result.txid}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Sign;