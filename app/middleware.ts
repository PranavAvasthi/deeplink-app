import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_ROUTES = ["/profile"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const matchedRoute = SUPPORTED_ROUTES.find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const deepLink = `com.example.expoDeepLink://deeplink${pathname}${search}`;

    const fallback =
      "https://play.google.com/store/apps/details?id=com.instagram.android";

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="refresh" content="0; url=${deepLink}" />
          <title>Opening App...</title>
          <script>
            setTimeout(() => {
              window.location.href = "${fallback}";
            }, 1500);
          </script>
        </head>
        <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
          <p>Redirecting to app…</p>
          <a href="${deepLink}">Tap here if it doesn’t open automatically</a>
        </body>
      </html>
    `;

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
