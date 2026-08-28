"use server";

import { createClient } from "@/lib/supabase/server";

export type ChangePasswordState = { error: string | null; success: boolean };

export async function changePassword(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) {
    return { error: "Kodeordet skal være mindst 8 tegn.", success: false };
  }
  if (password !== confirm) {
    return { error: "Kodeordene er ikke ens.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Kunne ikke skifte kodeord. Prøv igen.", success: false };
  }

  return { error: null, success: true };
}
