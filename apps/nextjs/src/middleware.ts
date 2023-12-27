import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";

import { env } from "./env.mjs";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // 최초 로그인 시, accessToken과 refreshToken을 기록하고 이후에는 쿠키를 사용
  const accessToken = request.headers.get("X-Access-Token");
  const refreshToken = request.headers.get("X-Refresh-Token");

  const requestHeaders = new Headers(request.headers);
  // x-pathname 헤더를 추가하여 요청 URL을 기록
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  // 사용한 accessToken과 refreshToken은 삭제
  requestHeaders.delete("X-Access-Token");
  requestHeaders.delete("X-Refresh-Token");

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  // 웹뷰 로그인 이후 token으로 로그인 처리
  if (pathname.startsWith("/") && accessToken && refreshToken) {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).then((re) => {
      if (re.data.session === null) {
        response.cookies.delete("sb-nlclqihmkqqmdmflexer-auth-token");
      }
      return response;
    })
    .catch((err) => {
      throw err;
    });;
    return response;
  }
  await supabase.auth
    .getSession()
    .then((re) => {
      if (re.data.session === null) {
        response.cookies.delete("sb-nlclqihmkqqmdmflexer-auth-token");
      }
      return response;
    })
    .catch((err) => {
      throw err;
    });
  return response;
}
