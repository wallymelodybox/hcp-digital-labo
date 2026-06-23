import { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  if (!basicAuth?.startsWith("Basic ")) {
    return false;
  }

  try {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");
    const validUser = process.env.ADMIN_USER || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "password123";

    return user === validUser && pwd === validPass;
  } catch {
    return false;
  }
}
