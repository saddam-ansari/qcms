jest.mock("../controllers/dashboardController", () => ({
    dashboard: jest.fn((req, res) => res.json({ ok: true }))
}));

const express = require("express");
const http = require("http");
const jwt = require("jsonwebtoken");
const dashboardRoutes = require("./dashboardRoutes");

let server;

const requestDashboard = (token) => new Promise((resolve, reject) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const request = http.get({
        hostname: "127.0.0.1",
        port: server.address().port,
        path: "/",
        headers
    }, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
            body += chunk;
        });
        response.on("end", () => {
            resolve({ statusCode: response.statusCode, body: JSON.parse(body) });
        });
    });
    request.on("error", reject);
});

describe("dashboard route authentication", () => {
    beforeAll((done) => {
        process.env.JWT_SECRET = "dashboard-route-test-secret";
        const app = express();
        app.use("/", dashboardRoutes);
        server = app.listen(0, "127.0.0.1", done);
    });

    afterAll((done) => {
        server.close(done);
    });

    test("rejects requests without a token", async () => {
        const response = await requestDashboard();

        expect(response.statusCode).toBe(401);
    });

    test("rejects authenticated users without an allowed role", async () => {
        const token = jwt.sign({ role: "Guest" }, process.env.JWT_SECRET);
        const response = await requestDashboard(token);

        expect(response.statusCode).toBe(403);
    });

    test("allows authenticated inspectors", async () => {
        const token = jwt.sign({ id: 1, role: "Inspector" }, process.env.JWT_SECRET);
        const response = await requestDashboard(token);

        expect(response).toEqual({ statusCode: 200, body: { ok: true } });
    });
});
