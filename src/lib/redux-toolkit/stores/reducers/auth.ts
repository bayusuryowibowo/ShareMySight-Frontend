import { createSlice } from "@reduxjs/toolkit";
import { AuthState } from "../definitions";

const initialState: AuthState = {
    isLoggedIn: false,
    access_token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.access_token = action.payload.access_token;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.access_token = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
