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
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("registers Inspector by default and never returns the password hash", async () => {
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
                password: "password"
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

    test("registers Manager when selected", async () => {
        findUserByEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashed-password");
        createUser.mockResolvedValue({
            id: 6,
            name: "Manager User",
            email: "manager@example.com",
            role: "Manager"
        });
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register({
            body: {
                name: "Manager User",
                email: "manager@example.com",
                password: "password",
                role: "Manager"
            }
        }, response);

        expect(createUser).toHaveBeenCalledWith(
            "Manager User",
            "manager@example.com",
            "hashed-password",
            "Manager"
        );
        expect(response.status).toHaveBeenCalledWith(201);
    });

    test("rejects unsupported account roles", async () => {
        const response = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await register({
            body: {
                name: "Manager User",
                email: "manager@example.com",
                password: "password",
                role: "Administrator"
            }
        }, response);

        expect(response.status).toHaveBeenCalledWith(400);
        expect(createUser).not.toHaveBeenCalled();
        expect(findUserByEmail).not.toHaveBeenCalled();
    });
});
