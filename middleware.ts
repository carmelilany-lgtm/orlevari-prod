import { getSafeAdminRedirect } from "@/lib/admin/safe-redirect";
import {
  DEFAULT_LOCALE,
  isPublicPagePath,
  localeFromHeaderValue,
  LOCALE_REQUEST_HEADER,
  parseLocaleFromPathname,
  stripLocalePrefix,
  withLocalePrefix,
} from "@/lib/i18n/locale-path";
import { LOCALE_STORAGE_KEY } from "@/types/i18n";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function withLocaleHeader(
  request: NextRequest,
  locale: string,
): Headers {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_REQUEST_HEADER, locale);
  return headers;
}

function persistLocaleCookie(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_STORAGE_KEY, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

function handlePublicLocale(request: NextRequest): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
    return null;
  }

  const headerLocale = localeFromHeaderValue(
    request.headers.get(LOCALE_REQUEST_HEADER),
  );
  if (headerLocale && !parseLocaleFromPathname(pathname)) {
    const response = NextResponse.next({
      request: { headers: withLocaleHeader(request, headerLocale) },
    });
    persistLocaleCookie(response, headerLocale);
    return response;
  }

  const pathLocale = parseLocaleFromPathname(pathname);
  if (pathLocale) {
    const inner = stripLocalePrefix(pathname);
    if (inner.startsWith("/admin") || inner.startsWith("/api")) {
      const url = request.nextUrl.clone();
      url.pathname = inner;
      return NextResponse.redirect(url);
    }

    const url = request.nextUrl.clone();
    url.pathname = inner;
    const response = NextResponse.rewrite(url, {
      request: { headers: withLocaleHeader(request, pathLocale) },
    });
    persistLocaleCookie(response, pathLocale);
    return response;
  }

  if (!isPublicPagePath(pathname)) {
    return null;
  }

  const url = request.nextUrl.clone();
  url.pathname = withLocalePrefix(DEFAULT_LOCALE, pathname);
  return NextResponse.redirect(url, 308);
}

export async function middleware(request: NextRequest) {
  const localeResponse = handlePublicLocale(request);
  if (localeResponse) return localeResponse;

  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const isAdminArea = pathname.startsWith("/admin");
  if (!isAdminArea) {
    return response;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === "/admin/login";
  const isServerAction =
    request.method === "POST" && request.headers.has("next-action");

  if (isAdminArea && !isLoginPage && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && user && !isServerAction) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = getSafeAdminRedirect(
      redirectUrl.searchParams.get("next"),
    );
    redirectUrl.search = "";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/he",
    "/en",
    "/he/:path*",
    "/en/:path*",
    "/privacy-policy",
    "/accessibility-statement",
    "/admin",
    "/admin/:path*",
  ],
};
