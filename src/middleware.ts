import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookies } from "next-client-cookies/server";

const protectedRoutes = ["/chat", "/video-call", "/ai", "/"];
const protectRoutesAuth = ["/login", "/register"];

export default function middleware(req: NextRequest) {
    const cookies = getCookies();
    const isAuthenticated = cookies.get("client_token");

    if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    if (isAuthenticated && protectRoutesAuth.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/video-call", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}
