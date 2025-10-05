import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import signatureRoutes from './routes/signatureRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', apiRoutes);
app.use('/api/signatures', signatureRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        network: process.env.BITCOIN_NETWORK || 'signet',
        mockMode: process.env.MOCK_INSCRIPTIONS === 'true',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'TruthBit API',
        status: 'running',
        mockMode: process.env.MOCK_INSCRIPTIONS === 'true'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════╗
║       TruthBit Backend Server         ║
╚═══════════════════════════════════════╝
  
  Server:    http://localhost:${PORT}
  API:       http://localhost:${PORT}/api
  Network:   ${process.env.BITCOIN_NETWORK || 'signet'}
  Mock Mode: ${process.env.MOCK_INSCRIPTIONS === 'true'}
  RPC Host:  ${process.env.BITCOIN_RPC_HOST || 'localhost'}
  
`);
});