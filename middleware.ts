import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const supportedPaths = ["/profile"];

  const shouldRedirect = supportedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldRedirect) {
    const appScheme = `com.example.expoDeepLink://deeplink${pathname}${search}`;
    const fallbackUrl =
      "https://play.google.com/store/apps/details?id=com.instagram.android";

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <script>
            window.location.href = "${appScheme}";
            setTimeout(() => {
              window.location.replace("${fallbackUrl}");
            }, 1000);
          </script>
        </head>
        <body></body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
