import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CookiesProvider } from "next-client-cookies/server";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "@/context/socketContext";
import "react-toastify/dist/ReactToastify.css";

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
                    <SocketProvider>
                        <body className={inter.className}>
                            {children}
                            <ToastContainer />
                        </body>
                    </SocketProvider>
                </AuthProvider>
            </CookiesProvider>
        </html>
    );
}
