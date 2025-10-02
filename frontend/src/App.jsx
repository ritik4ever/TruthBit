import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Publish from './pages/Publish';
import Article from './pages/Article';
import Verify from './pages/Verify';

function App() {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isConnected && address) {
            // Create user from wallet
            const newUser = {
                id: 'user_' + address.slice(0, 8),
                address: address,
                name: 'Wallet User',
                verificationLevel: 'verified',
                credentialType: 'Journalist',
                ordinalId: 'ord_' + address.slice(0, 10),
                articlesPublished: 0
            };
            setUser(newUser);
            localStorage.setItem('truthvault_user', JSON.stringify(newUser));
        } else {
            setUser(null);
            localStorage.removeItem('truthvault_user');
        }
    }, [isConnected, address]);

    const handleLogout = () => {
        disconnect();
        setUser(null);
        localStorage.removeItem('truthvault_user');
    };

    return (
        <BrowserRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header user={user} onLogout={handleLogout} />
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route
                            path="/dashboard"
                            element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
                        />
                        <Route
                            path="/publish"
                            element={user ? <Publish user={user} /> : <Navigate to="/" />}
                        />
                        <Route path="/article/:id" element={<Article user={user} />} />
                        <Route path="/verify/:id" element={<Verify />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;