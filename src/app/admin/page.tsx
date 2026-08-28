import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminLogout } from "./actions";
import {
  ApplicationStatusControls,
  EnrollmentStatusControls,
  SessionPaymentStatusControls,
} from "./StatusControls";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();

  const [{ data: applications }, { data: enrollments }, { data: billableSessions }] =
    await Promise.all([
      supabase.from("applications").select("*").order("created_at", { ascending: false }),
      supabase
        .from("enrollments")
        .select("id, status, cycle_start, cycle_end, children(name), teams(name)")
        .order("cycle_end"),
      supabase
        .from("sessions")
        .select("id, title, session_date, price, payment_status, children(name)")
        .not("price", "is", null)
        .order("session_date"),
    ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold uppercase text-text">
          Admin — Copenhagen Academy
        </h1>
        <form action={adminLogout}>
          <button type="submit" className="text-xs font-semibold text-text-muted hover:text-text">
            Log ud
          </button>
        </form>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
          Ansøgninger
        </h2>
        <div className="flex flex-col gap-2">
          {(applications ?? []).length === 0 && (
            <p className="text-sm text-text-muted">Ingen ansøgninger endnu.</p>
          )}
          {(applications ?? []).map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-2 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-text">
                  {app.player_name} · {app.birth_year}
                </div>
                <div className="text-xs text-text-muted">
                  {app.current_club || "Ingen tidligere klub"} ·{" "}
                  {app.parent_email || "ingen email"} · {app.parent_phone || "intet tlf"}
                </div>
                <div className="text-xs text-text-dim">
                  {new Date(app.created_at).toLocaleString("da-DK")}
                </div>
              </div>
              <ApplicationStatusControls id={app.id} status={app.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
          Faste hold — betalingsstatus
        </h2>
        <div className="flex flex-col gap-2">
          {(enrollments ?? []).length === 0 && (
            <p className="text-sm text-text-muted">Ingen tilmeldinger endnu.</p>
          )}
          {(enrollments ?? []).map((e) => (
            <div
              key={e.id}
              className="flex flex-col gap-2 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-text">
                  {e.children?.name} · {e.teams?.name}
                </div>
                <div className="text-xs text-text-muted">
                  {e.cycle_start} – {e.cycle_end}
                </div>
              </div>
              <EnrollmentStatusControls id={e.id} status={e.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-sm font-bold tracking-[.2em] text-text uppercase">
          Enkeltbetalinger — Workshop &amp; events
        </h2>
        <div className="flex flex-col gap-2">
          {(billableSessions ?? []).length === 0 && (
            <p className="text-sm text-text-muted">Ingen enkeltbetalinger endnu.</p>
          )}
          {(billableSessions ?? []).map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-2 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-text">
                  {s.children?.name} · {s.title}
                </div>
                <div className="text-xs text-text-muted">
                  {s.session_date} · {s.price} kr
                </div>
              </div>
              <SessionPaymentStatusControls id={s.id} status={s.payment_status ?? "afventer"} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
