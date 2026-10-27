jest.mock("bcrypt", () => ({
    hash: jest.fn()
}));

jest.mock("../models/userModel", () => ({
    createUser: jest.fn(),
    findUserByEmail: jest.fn()
}));

const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("../models/userModel");
const { register } = require("./authController");

describe("register", () => {
    test("assigns the least-privileged role and never returns the password hash", async () => {
        findUserByEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashed-password");
        createUser.mockResolvedValue({
            id: 5,
            name: "Test User",
            email: "test@example.com",
            role: "Inspector",
            password: "hashed-password"
        });

        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register({
            body: {
                name: "Test User",
                email: "test@example.com",
                password: "password",
                role: "Manager"
            }
        }, response);

        expect(createUser).toHaveBeenCalledWith(
            "Test User",
            "test@example.com",
            "hashed-password",
            "Inspector"
        );
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.json).toHaveBeenCalledWith({
            message: "User registered successfully",
            user: {
                id: 5,
                name: "Test User",
                email: "test@example.com",
                role: "Inspector"
            }
        });
    });
});
