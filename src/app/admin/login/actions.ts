"use server";

import { redirect } from "next/navigation";
import { setAdminCookie } from "@/lib/admin-auth";

export type AdminLoginState = { error: string | null };

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return { error: "ADMIN_PASSWORD er ikke sat op på serveren." };
  }
  if (password !== expected) {
    return { error: "Forkert adgangskode." };
  }

  await setAdminCookie();
  redirect("/admin");
}
