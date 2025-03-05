import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to protect admin routes
export async function middleware(request)
{
    // Check if the route is admin-related
    if (request.nextUrl.pathname.startsWith('/BlogAdmin') ||
        request.nextUrl.pathname.startsWith('/api/admin'))
    {
        console.log("Middleware: Checking auth for", request.nextUrl.pathname);

        const authToken = request.cookies.get('authToken')?.value;

        if (!authToken)
        {
            console.log("Middleware: No auth token found");
            // Redirect to home if no token exists
            return NextResponse.redirect(new URL('/', request.url));
        }

        try
        {
            // Verify the token using jose library instead of jsonwebtoken
            // Convert the secret to TextEncoder for jose
            const secret = new TextEncoder().encode(JWT_SECRET);

            const { payload } = await jwtVerify(authToken, secret);
            console.log("Middleware: Token verified for user:", payload.username);

            // Allow the request to continue
            return NextResponse.next();
        } catch (error)
        {
            console.error("Middleware: Token verification failed:", error.message);
            // Token is invalid or expired
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/BlogAdmin/:path*', '/api/admin/:path*'],
}; 