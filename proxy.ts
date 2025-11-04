import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const supportedPaths = ["/profile"];

  const shouldHandle = supportedPaths.some((path) => pathname.startsWith(path));
  if (!shouldHandle) return NextResponse.next();

  const appBase = "deeplink-app-blush.vercel.app";
  const fullPath = `${appBase}${pathname}${req.nextUrl.search}`;

  const intentLink = `intent://${fullPath}#Intent;scheme=https;package=com.instagram.android;end`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          window.location.href = "${intentLink}";
        </script>
      </head>
      <body></body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export const config = {
  matcher: ["/profile/:path*"],
};
