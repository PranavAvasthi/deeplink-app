import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🔥 Middleware triggered for:", req.nextUrl.pathname);

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const supportedPaths = ["/profile", "/competition", "/reward"];
  const shouldRedirect = supportedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (shouldRedirect) {
    const appScheme = `com.example.expoDeepLink://deeplink${pathname}${url.search}`;
    const fallbackUrl = `https://play.google.com/store/apps/details?id=com.instagram.android`;

    const html = `
      <html>
        <head>
          <meta http-equiv="refresh" content="1.5; url='${fallbackUrl}'" />
          <script>
            window.location.replace("${appScheme}");
            setTimeout(() => {
              window.location.replace("${fallbackUrl}");
            }, 1500);
          </script>
        </head>
        <body>Redirecting...</body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/competition/:path*", "/reward/:path*"],
};
