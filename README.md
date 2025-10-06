# TruthBit

TruthBit — Trustless Publishing on Bitcoin

Publish, Verify, and Preserve Truth — Powered by Xverse + Bitcoin Ordinals

TruthBit is a decentralized publishing platform that allows users to sign documents, publish articles publicly or anonymously, and verify them on-chain — leveraging the Xverse API and Bitcoin Ordinals.

🚀 Features

✍️ Create & Sign Articles — Digitally sign your content using cryptographic proofs.

🔐 Publish Anonymously or Publicly — Choose your identity visibility.

🧾 Verify Authenticity On-Chain — Immutable record of truth on the Bitcoin blockchain.

⚡ Powered by Xverse API — Secure inscription and storage using SecretKey Labs endpoints.

🌐 Fullstack App — Seamless frontend + backend integration.

🏗️ Tech Stack
Layer	Tech Used
Frontend	React + Vite + TailwindCSS
Backend	Node.js + Express
Blockchain	Bitcoin Signet/Testnet via Xverse API
Storage	Local JSON database (mock)
Auth	Optional MetaMask / Wallet signing (coming soon)
⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/truthbit.git
cd truthbit

2️⃣ Backend Setup
cd backend
npm install

Create .env file
PORT=5000
BITCOIN_NETWORK=signet
XVERSE_API_KEY=your_secret_xverse_api_key
INSCRIPTION_MAX_ATTEMPTS=30
INSCRIPTION_POLL_MS=10000

Run the backend
npm run dev


Your backend runs at http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at http://localhost:5173
 (by default)

🔗 Xverse API Configuration

TruthBit integrates with SecretKey Labs (Xverse):

Network	Endpoint URL
Mainnet	https://api.secretkeylabs.io
Signet	https://api-signet.secretkeylabs.io
Testnet4	https://api-testnet4.secretkeylabs.io

All requests require your XVERSE_API_KEY in the Authorization header.

Example:

Authorization: Bearer your_secret_xverse_api_key

🧩 API Endpoints
Method	Endpoint	Description
POST	/api/content/articles	Create and inscribe a new article
GET	/api/content/articles	Fetch all published articles
GET	/api/content/articles/:id	Fetch a specific article
POST	/api/content/articles/:id/view	Increment article view count
🪶 Publishing Flow

1️⃣ User writes or uploads content.
2️⃣ Content is signed cryptographically.
3️⃣ A cost estimation is requested from the Xverse API.
4️⃣ The inscription order is created.
5️⃣ The article is permanently inscribed on Bitcoin.
6️⃣ A verification badge + ordinal ID are shown to the user.

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

This project is licensed under the MIT License — open for innovation.

💬 Credits

Built with ❤️ by Ritik
Powered by Bitcoin, Xverse API, TruthBit Community and Open Ordinal Community
