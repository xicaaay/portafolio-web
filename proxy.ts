import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, hasLocale, type Locale } from "./lib/i18n/config";

/* Idioma preferido: primero la cookie (elección anterior) y luego el idioma del navegador. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase().split("-")[0];
    if (hasLocale(tag)) return tag;
  }
  return DEFAULT_LOCALE;
}

/* El prefijo existe solo internamente; los enlaces antiguos guardan el idioma y se normalizan. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = LOCALES.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));

  const url = request.nextUrl.clone();
  if (prefix) {
    if (request.headers.get("x-portfolio-rewrite") === "1") return NextResponse.next();
    url.pathname = pathname.slice(prefix.length + 1) || "/";
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, prefix, { path: "/", maxAge: 31536000, sameSite: "lax" });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  const headers = new Headers(request.headers);
  headers.set("x-portfolio-rewrite", "1");
  const response = NextResponse.rewrite(url, { request: { headers } });
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  /* No toca el admin de Payload, la API, los archivos internos de Next ni los archivos con extensión. */
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
