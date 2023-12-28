import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CookiesProvider } from "next-client-cookies/server";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <CookiesProvider>
                <AuthProvider>
                    <body className={inter.className}>{children}</body>
                </AuthProvider>
            </CookiesProvider>
        </html>
    );
}
