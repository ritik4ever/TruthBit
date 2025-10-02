import React from 'react';
import { useAccount } from 'wagmi';
import Hero from '../components/Hero';

function Home({ user }) {
    const { isConnected } = useAccount();

    return (
        <div>
            <Hero isConnected={isConnected} />
        </div>
    );
}

export default Home;