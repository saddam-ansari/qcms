// Import bcrypt
const bcrypt = require("bcrypt");
// Import JWT
const jwt = require("jsonwebtoken");

// Import User Model
const { createUser, findUserByEmail } = require("../models/userModel");


// REGISTER USER
const register = async (req, res) => {
    try {
        const { name, email, password, role = "Inspector" } = req.body;

        if (role !== "Inspector" && role !== "Manager") {
            return res.status(400).json({ message: "Invalid account role" });
        }

        // Check existing user
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const user = await createUser(name, email, hashedPassword, role);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN USER
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "Login successful",
            token,
            name: user.name,
            role: user.role
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { register, login };