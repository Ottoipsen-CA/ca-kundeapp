"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin, clearAdminCookie } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ApplicationStatus, PaymentStatusDb } from "@/lib/supabase/types";

async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("applications").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function setEnrollmentStatus(id: string, status: PaymentStatusDb) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("enrollments").update({ status }).eq("id", id);
  revalidatePath("/admin");
}

export async function setSessionPaymentStatus(id: string, status: PaymentStatusDb) {
  await requireAdmin();
  const supabase = createAdminClient();
  await supabase.from("sessions").update({ payment_status: status }).eq("id", id);
  revalidatePath("/admin");
}
