# TruthBit

TruthBit — Trustless Publishing on Bitcoin

Publish, Sign, Verify, and Preserve Truth — Powered by Xverse + Bitcoin Ordinals

TruthBit is a decentralized publishing and document verification platform built on the Bitcoin blockchain.
It allows users to sign documents, publish articles (publicly or anonymously), and verify authenticity on-chain, leveraging the Xverse API and Bitcoin Ordinals.

🌐 Live Demo

🔗 Website: https://truth-bit.vercel.app/

🎥 Demo Video: https://youtu.be/2UWFuG6ftw8

🚀 Features

✍️ Create & Sign Articles — Digitally sign content with cryptographic proofs.

🔐 Publish Publicly or Anonymously — Choose visibility and protect your identity.

🧾 Verify Authenticity On-Chain — Every publication becomes an immutable Bitcoin record.

⚡ Powered by Xverse API — Secure inscription and storage via SecretKey Labs endpoints.

🌐 Fullstack DApp — Smooth integration between frontend and backend.

📜 Document Signing — Sign and verify official documents with Ordinal-based proofs.

🏗️ Tech Stack
Layer	Technology
Frontend	React + Vite + TailwindCSS
Backend	Node.js + Express
Blockchain	Bitcoin (Signet/Testnet via Xverse API)
Storage	Local JSON database (mock)
Auth (upcoming)	Wallet-based signing via MetaMask / Xverse
⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/truthbit.git
cd truthbit

2️⃣ Backend Setup
cd backend
npm install


Create a .env file in the backend directory:

PORT=5000
BITCOIN_NETWORK=signet
XVERSE_API_KEY=your_secret_xverse_api_key
INSCRIPTION_MAX_ATTEMPTS=30
INSCRIPTION_POLL_MS=10000


Start the backend server:

npm run dev


Your backend runs at: http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Your frontend runs at: http://localhost:5173

🔗 Xverse API Configuration

TruthBit integrates with SecretKey Labs (Xverse) endpoints:

Network	Endpoint URL
Mainnet	https://api.secretkeylabs.io

Signet	https://api-signet.secretkeylabs.io

Testnet4	https://api-testnet4.secretkeylabs.io

All requests must include your API key:

Authorization: Bearer your_secret_xverse_api_key

🧩 API Endpoints
Method	Endpoint	Description
POST	/api/content/articles	Create and inscribe a new article
GET	/api/content/articles	Fetch all published articles
GET	/api/content/articles/:id	Fetch a specific article
POST	/api/content/articles/:id/view	Increment article view count
🪶 Publishing Flow

1️⃣ User writes or uploads content
2️⃣ Content is digitally signed
3️⃣ Xverse API estimates cost
4️⃣ Inscription order is created
5️⃣ Article is inscribed on Bitcoin
6️⃣ Verification badge + Ordinal ID displayed to the user

🧱 Example Output
Inscribe called - mock mode: false
Posting inscription order to Xverse...
Inscription order created: orderId=abc123, paymentAddress=tb1qxyz...
MAINNET: send 20000 sats to complete inscription
Inscription confirmed: inscriptionId=ord_article_1759762210469

🧠 Future Enhancements

🪪 Wallet-based authentication (MetaMask / Xverse Wallet)

🌉 Cross-chain verification (Ethereum ↔ Bitcoin)

🪶 Decentralized Storage via IPFS / Arweave

🔎 Article search and curation engine

🧾 License

This project is licensed under the MIT License — open for innovation and collaboration.

💬 Credits

Built with ❤️ by Ritik
Powered by Bitcoin, Xverse API, TruthBit Community, and Open Ordinal Hackathon.
