import axios from "axios";
import api from "./api";

describe("API authentication handling", () => {
    beforeEach(() => {
        localStorage.setItem("token", "expired-token");
        localStorage.setItem("role", "Inspector");
        localStorage.setItem("name", "Test User");
    });

    test("clears the session and signals expiry for an API 401", async () => {
        const sessionExpired = jest.fn();
        window.addEventListener("auth:expired", sessionExpired);
        const adapter = (config) => Promise.reject(new axios.AxiosError(
            "Unauthorized",
            "ERR_BAD_REQUEST",
            config,
            null,
            {
                status: 401,
                statusText: "Unauthorized",
                data: {},
                headers: {},
                config
            }
        ));

        await expect(api.get("/dashboard", { adapter })).rejects.toMatchObject({
            response: { status: 401 }
        });

        expect(localStorage.getItem("token")).toBeNull();
        expect(localStorage.getItem("role")).toBeNull();
        expect(localStorage.getItem("name")).toBeNull();
        expect(sessionExpired).toHaveBeenCalledTimes(1);
        window.removeEventListener("auth:expired", sessionExpired);
    });

    test("does not expire an existing session for an authentication 401", async () => {
        const adapter = (config) => Promise.reject(new axios.AxiosError(
            "Unauthorized",
            "ERR_BAD_REQUEST",
            config,
            null,
            {
                status: 401,
                statusText: "Unauthorized",
                data: {},
                headers: {},
                config
            }
        ));

        await expect(api.post("/auth/login", {}, { adapter })).rejects.toMatchObject({
            response: { status: 401 }
        });

        expect(localStorage.getItem("token")).toBe("expired-token");
        expect(localStorage.getItem("role")).toBe("Inspector");
        expect(localStorage.getItem("name")).toBe("Test User");
    });
});
