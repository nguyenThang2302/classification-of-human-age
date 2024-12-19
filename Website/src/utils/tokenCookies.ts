import { destroyCookie, parseCookies, setCookie } from "nookies";
import { jwtDecode } from "jwt-decode";
import * as _ from "lodash";
import {
  COOKIE_EXPIRATION_TIME,
  REFRESH_TOKEN_COOKIE,
  TOKEN_COOKIE,
} from "@/utils";

type CreateSessionCookiesParams = {
  token?: string;
  refreshToken?: string;
};

export function createSessionCookies(params: CreateSessionCookiesParams) {
  const { token, refreshToken } = params;

  if (token) {
    setCookie(null, TOKEN_COOKIE, token, {
      maxAge: COOKIE_EXPIRATION_TIME,
      path: "/",
    });
  }

  if (refreshToken) {
    setCookie(null, REFRESH_TOKEN_COOKIE, refreshToken, {
      maxAge: COOKIE_EXPIRATION_TIME,
      path: "/",
    });
  }
}

export function removeSessionCookies() {
  destroyCookie(null, TOKEN_COOKIE);
  destroyCookie(null, REFRESH_TOKEN_COOKIE);
}

export function getToken() {
  return localStorage.getItem('access_token');
}

export function isAdminRole(token: string) {
  if (!token) return false;
  const payload = jwtDecode(token);
  return _.get(payload, 'role_id') === 1;
}

export function getRefreshToken() {
  const cookies = parseCookies();
  return cookies[REFRESH_TOKEN_COOKIE];
}
