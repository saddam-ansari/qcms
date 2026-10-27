import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name")
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.role = action.payload.role;
            state.name = action.payload.name;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("role", action.payload.role);
            localStorage.setItem("name", action.payload.name);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = null;
            state.name = null;
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("name");
        }
    }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;