"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { useRef } from "react";
import { AppStore, makeStore } from "../lib/stores";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }

    return (
        <html lang="en">
            <Provider store={storeRef.current}>
                <body className={inter.className}>{children}</body>
            </Provider>
        </html>
    );
}
