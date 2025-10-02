import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import signatureRoutes from './routes/signatureRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import apiRoutes from './routes/api.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'BITCOIN_NETWORK'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`ERROR: ${envVar} is not set in .env file`);
        process.exit(1);
    }
}

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/api/signatures', signatureRoutes);

// Logging middleware
app.use((req, res, next) => {
    if (process.env.LOG_LEVEL === 'debug') {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    }
    next();
});

// Routes
app.use('/api', apiRoutes);

// Health check with network info
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        network: process.env.BITCOIN_NETWORK,
        version: '1.0.0',
        timestamp: new Date().toISOString()
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

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║       TruthBit Backend Server       ║
╚═══════════════════════════════════════╝
  
  🚀 Server:    http://localhost:${PORT}
  📝 API:       http://localhost:${PORT}/api
  🌐 Network:   ${process.env.BITCOIN_NETWORK}
  🔧 Mode:      ${process.env.NODE_ENV}
  📊 Ord:       ${process.env.ORD_SERVER_URL}
  
`);
});