import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const supportedPaths = ["/profile"];

  const shouldHandle = supportedPaths.some((path) => pathname.startsWith(path));
  if (!shouldHandle) return NextResponse.next();

  const appLink = `https://deeplink-app-blush.vercel.app${pathname}${req.nextUrl.search}`;

  const fallbackUrl =
    "https://play.google.com/store/apps/details?id=com.instagram.android";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          window.location.href = "${appLink}";
          
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

export const config = {
  matcher: ["/profile/:path*"],
};
