import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL } from "@/constants";

// Strip trailing /api/ to get the base server URL
const serverBaseURL = BACKEND_BASE_URL.replace(/\/api\/?$/, "");

export const authClient = createAuthClient({
    baseURL: serverBaseURL,
});
