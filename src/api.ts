import axios from "axios";

// Laravel API address. Override with VITE_API_URL in a .env file.
export const baseUrl: string =
  import.meta.env.VITE_API_URL ?? "http://vue-hospital-api.test/";
export const baseUrlApi = `${baseUrl}api/`;

// other environments (keep for quick switching)
// export const baseUrl = "https://laravelapi.safiwebapp.xyz/";
// export const baseUrl = "http://react-hospital-api.test/";

export const api = axios.create({
  baseURL: baseUrlApi,
  headers: {
    "Content-Type": "application/json",
    // "Authorization": "Bearer " + localStorage.getItem("lara_token"),
  },
});


import { auth, clearSession } from "./utils/auth";   // file-er upore import-er sathe

// send the Sanctum token with every request
api.interceptors.request.use((config) => {
  if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
  return config;
});

// token expired / revoked -> back to the login page
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url: string = err.config?.url ?? "";
    if (err.response?.status === 401 && !["login", "register"].includes(url)) {
      clearSession();
      import("./route").then(({ router }) => router.push("/login"));
    }
    return Promise.reject(err);
  },
);
