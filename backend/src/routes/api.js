import express from 'express';
import * as identityController from '../controllers/identityController.js';
import * as contentController from '../controllers/contentController.js';
import * as verificationController from '../controllers/verificationController.js';

const router = express.Router();

// Identity routes
router.post('/identity/create', identityController.createIdentity);
router.get('/identity/:id', identityController.getIdentity);

// Content routes - FIXED PATHS
router.post('/content/articles', contentController.createArticle);
router.get('/content/articles', contentController.getArticles);
router.get('/content/articles/:id', contentController.getArticle);
router.post('/content/articles/:id/view', contentController.incrementView);

// Verification routes
router.get('/verify/:id', verificationController.verifyArticle);

export default router;