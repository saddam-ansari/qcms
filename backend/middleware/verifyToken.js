const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Get token from request header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Expected format: Bearer <token>
    const token = authHeader.split(" ")[1];

    try {
        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save user information for later use
        req.user = decoded;

        // Continue to the next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;