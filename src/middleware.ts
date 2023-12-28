import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCookies } from "next-client-cookies/server";

const protectedRoutes = ["/"];

export default function middleware(req: NextRequest) {
    const cookies = getCookies();
    const isAuthenticated = !!cookies.get("access_token");

    if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}
