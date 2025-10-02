export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
    }

    try {
        // Simple token validation (implement proper JWT in production)
        const token = authHeader.split(' ')[1];

        if (!token || token.length < 10) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Attach user info to request
        req.user = {
            id: 'user_' + token.substring(0, 10),
            verified: true
        };

        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};