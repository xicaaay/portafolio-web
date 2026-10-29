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

/* Las rutas sin idioma (/, /projects...) se redirigen a /es/... o /en/... */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasPrefix = LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasPrefix) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /* No toca el admin de Payload, la API, los archivos internos de Next ni los archivos con extensión. */
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
