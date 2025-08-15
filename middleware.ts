import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { stripAppSubdomain } from "./lib/utils";

const PUBLIC_PATHS = ["/login", "/signup", "/register", "signin"];
export default auth(async (req) => {

    const hostname = req.headers.get('host')!;
    const subdomain = hostname.match(/^([^.]+)\./)?.[1];
    const pathname = req.nextUrl.pathname
    // const issubdomain = subdomain?.startsWith('app');

    const host = stripAppSubdomain(req.headers.get('host')?.toString() as string);



    if (!subdomain) {
        const isPublicPath = PUBLIC_PATHS.some((publicpath) => pathname.startsWith(publicpath));
        if (isPublicPath) {
            return NextResponse.redirect(new URL(`http://app.${host}${pathname}`, req.url));
        }
        console.log("redirecting to app");

        return NextResponse.next();
    }


    switch (subdomain) {
        //case "app-lap":
        case "app":
            {
                const PROTECTED_PATHS = ["/dashboard",]; // Add all your exact protected paths here
                const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                const isLoggedin = req.auth
                if (!isLoggedin && isProtectedPath) {
                    return NextResponse.redirect(new URL(`/login`, req.url));
                }
                return NextResponse.rewrite(new URL(`/app${req.nextUrl.pathname}`, req.url));

            }
        //case "web-lap":
            case "web":
                {
                    const PROTECTED_PATHS = [""]; //add all exact protected paths here
                    const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                    const isLoggedin = req.auth;
                    if(!isLoggedin && isProtectedPath){
                        return NextResponse.redirect(new URL("/signin", req.url));
                    } 
                    return NextResponse.rewrite(new URL(`/web${req.nextUrl.pathname}`, req.url))
                }
        //case "admin-lap":
        case "admin":
            {
                const PROTECTED_PATHS = ["/", "/profile", "/settings", "/checkout", "/orders"]; // Add all your exact protected paths here
                const isProtectedPath = PROTECTED_PATHS.includes(pathname);
                const isLoggedin = req.auth
                if (!isLoggedin && isProtectedPath) {
                    return NextResponse.redirect(new URL(`/auth`, req.url));
                }
                return NextResponse.rewrite(new URL(`/admin${req.nextUrl.pathname}`, req.url));
            }
            case "api":
                {
                    return NextResponse.rewrite(new URL(`/api${req.nextUrl.pathname}`, req.url));
                }

        default:
            return NextResponse.next();
    }
    // return NextResponse.rewrite(new URL(`/app${req.nextUrl.pathname}`, req.url));
    // // return NextResponse.next();

})


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next (Next.js internals)
         * - static (static files)
         * - favicon.ico, robots.txt, etc.
         */
        // "/((?!_next|images|favicon.ico|robots.txt|sitemap.xml).*)",
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+$|.*\\.[^/]+$).*)",
        // "/((?!_next/|favicon.ico|robots.txt|manifest.json|static/|.*\\..*).*)",

    ],
};