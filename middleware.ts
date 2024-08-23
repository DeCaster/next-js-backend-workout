import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/api/logMiddleware";

export const config = {
    matcher: ["/api/:path*"],
}

export default function middleware(request: Request) {
    if (request.url.includes("/api/blogs")) {
        const logResult = logMiddleware(request);
        console.log(logResult.response);
    }

    const authResult = authMiddleware(request); // Artık tek bir argümanla çağrılıyor.

    if (!authResult?.isValid) {
        return new NextResponse(JSON.stringify({ message: 'Unauthorized User, please Register/Login' }), { status: 401 });
    }

    return NextResponse.next();
}

