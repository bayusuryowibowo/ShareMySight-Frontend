import axios from "axios";
import { getCookies } from "next-client-cookies/server";

export const apiClient = axios.create({
    baseURL: "http://localhost:8082",
    withCredentials: false,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((config) => {
    const cookies = getCookies();
    const accessToken = cookies.get("access_token");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});
