#!/bin/bash

NETWORK=$1

if [ -z "$NETWORK" ]; then
    echo "Usage: ./switch-network.sh [testnet|mainnet|regtest]"
    exit 1
fi

echo "Switching to $NETWORK..."

# Update frontend .env
sed -i.bak "s/VITE_BITCOIN_NETWORK=.*/VITE_BITCOIN_NETWORK=$NETWORK/" frontend/.env

# Update backend .env
sed -i.bak "s/BITCOIN_NETWORK=.*/BITCOIN_NETWORK=$NETWORK/" backend/.env

echo "✓ Network switched to $NETWORK"
echo "⚠️  Remember to restart your ord server for $NETWORK"
echo "⚠️  Restart frontend and backend servers"