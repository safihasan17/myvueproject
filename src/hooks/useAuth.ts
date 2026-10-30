import { api } from "@/api";
import { auth, clearSession, setSession } from "@/utils/auth";

export async function login(email: string, password: string) {
  const res = await api.post("login", { email, password });
  setSession(res.data.token, res.data.user);
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const res = await api.post("register", data);
  return res.data.success as string;
}

export async function logout() {
  try {
    await api.post("logout");
  } catch {
    /* token already invalid, just sign out locally */
  }
  clearSession();
}

export { auth };
