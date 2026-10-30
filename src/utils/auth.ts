import { reactive } from "vue";

// Sanctum token + user, kept in localStorage so a refresh keeps you signed in.
const TOKEN_KEY = "lara_token";
const USER_KEY = "lara_user";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role_id?: number;
  role?: { id: number; name: string } | null;
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // storage unavailable
  }
}

function readUser(): AuthUser | null {
  try {
    return JSON.parse(read(USER_KEY) ?? "null");
  } catch {
    return null;
  }
}

export const auth = reactive<{ token: string | null; user: AuthUser | null }>({
  token: read(TOKEN_KEY),
  user: readUser(),
});

export function setSession(token: string, user: AuthUser) {
  auth.token = token;
  auth.user = user;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable */
  }
}

export function clearSession() {
  auth.token = null;
  auth.user = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* storage unavailable */
  }
}
