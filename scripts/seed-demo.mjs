// One-off script: creates a demo parent account (Mette) plus Oscar & Alma,
// with the same fixtures the app used to ship as in-memory mock data —
// enrollments, this week's sessions, badges and payment history.
//
// Requires the schema to already exist (run the SQL in supabase/migrations/
// via the Supabase SQL editor first), and these env vars set (in .env.local
// or the shell):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// Run with: node scripts/seed-demo.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

// Load .env.local by hand so this works with a plain `node` invocation.
try {
  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
} catch {
  // no .env.local — assume vars are already in the environment
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEMO_EMAIL = "mette@example.com";
const DEMO_PASSWORD = "skift-mig-123";

async function main() {
  console.log("Creating demo parent user…");
  const { data: userRes, error: userErr } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
  });

  let userId = userRes?.user?.id;
  if (userErr) {
    if (userErr.message.includes("already been registered")) {
      const { data: list } = await supabase.auth.admin.listUsers();
      userId = list.users.find((u) => u.email === DEMO_EMAIL)?.id;
    } else {
      throw userErr;
    }
  }
  if (!userId) throw new Error("Could not resolve demo user id");

  await supabase.from("parents").upsert({
    id: userId,
    full_name: "Mette Nørgaard",
    email: DEMO_EMAIL,
  });

  console.log("Creating children…");
  const { data: oscar } = await supabase
    .from("children")
    .upsert(
      {
        parent_id: userId,
        name: "Oscar Nørgaard",
        initials: "ON",
        age_group: "U11",
        position: "Midtbane",
        club: "U11 Performance",
        streak_weeks: 14,
        attendance_pct: 92,
        sessions_count: 47,
        technique_score: 78,
        technique_delta: 6,
        tactics_score: 64,
        tactics_delta: 9,
        physical_score: 71,
        physical_delta: 4,
        development_history: [52, 48, 44, 38, 30, 22, 14],
        development_months: ["MAR", "APR", "MAJ", "JUN", "JUL", "AUG"],
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  const { data: alma } = await supabase
    .from("children")
    .upsert(
      {
        parent_id: userId,
        name: "Alma Nørgaard",
        initials: "AN",
        age_group: "U9",
        position: "Angriber",
        club: "U9 Udvikling",
        streak_weeks: 6,
        attendance_pct: 85,
        sessions_count: 21,
        technique_score: 61,
        technique_delta: 8,
        tactics_score: 49,
        tactics_delta: 5,
        physical_score: 66,
        physical_delta: 7,
        development_history: [58, 53, 48, 42, 37, 33, 30],
        development_months: ["MAR", "APR", "MAJ", "JUN", "JUL", "AUG"],
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (!oscar || !alma) throw new Error("Could not create children");

  console.log("Creating badges…");
  await supabase.from("badges").delete().in("child_id", [oscar.id, alma.id]);
  await supabase.from("badges").insert([
    { child_id: oscar.id, key: "streak10", label: "10 uger i træk", kind: "number", value: "10", unlocked: true },
    { child_id: oscar.id, key: "iron", label: "Jernvilje", kind: "check", value: "", unlocked: true },
    { child_id: oscar.id, key: "firstcamp", label: "Første camp", kind: "text", value: "1.", unlocked: true },
    { child_id: oscar.id, key: "streak20", label: "20 uger i træk", kind: "number", value: "20", unlocked: false },
    { child_id: alma.id, key: "streak5", label: "5 uger i træk", kind: "number", value: "5", unlocked: true },
    { child_id: alma.id, key: "firsttraining", label: "Første træning", kind: "text", value: "1.", unlocked: true },
    { child_id: alma.id, key: "iron", label: "Jernvilje", kind: "check", value: "", unlocked: false },
    { child_id: alma.id, key: "streak10", label: "10 uger i træk", kind: "number", value: "10", unlocked: false },
  ]);

  console.log("Creating enrollments…");
  await supabase.from("enrollments").delete().in("child_id", [oscar.id, alma.id]);
  await supabase.from("enrollments").insert([
    {
      child_id: oscar.id,
      team_id: "tirsdag",
      cycle_start: "2026-08-01",
      cycle_end: "2026-11-01",
      status: "afventer",
    },
    {
      child_id: oscar.id,
      team_id: "fredag-bk-union",
      cycle_start: "2026-08-01",
      cycle_end: "2026-09-18",
      status: "gratis",
    },
    {
      child_id: alma.id,
      team_id: "fredag-bk-union",
      cycle_start: "2026-08-01",
      cycle_end: "2026-09-18",
      status: "gratis",
    },
  ]);

  console.log("Creating this week's sessions…");
  await supabase.from("sessions").delete().in("child_id", [oscar.id, alma.id]);
  await supabase.from("sessions").insert([
    {
      child_id: oscar.id,
      team_id: "tirsdag",
      session_date: "2026-08-25",
      weekday: "TIR",
      title: "Tirsdagshold",
      time: "17:00–18:15",
      location: "Fælledparken",
      type: "training",
      signed_up: true,
      coach: "Mikkel",
    },
    {
      child_id: oscar.id,
      team_id: "fredag-bk-union",
      session_date: "2026-08-28",
      weekday: "FRE",
      title: "Fredag · BK Union",
      time: "16:30–17:45",
      location: "Kløvermarken, bane 4",
      type: "training",
      signed_up: true,
      coach: "Mikkel",
    },
    {
      child_id: alma.id,
      team_id: "fredag-bk-union",
      session_date: "2026-08-28",
      weekday: "FRE",
      title: "Fredag · BK Union",
      time: "16:30–17:45",
      location: "Kløvermarken, bane 4",
      type: "training",
      signed_up: false,
      coach: "Mikkel",
    },
    {
      child_id: oscar.id,
      team_id: "soendag-workshop",
      session_date: "2026-08-30",
      weekday: "SØN",
      title: "Søndag Workshop",
      time: "10:00–12:00",
      location: "Valby Idrætspark",
      type: "training",
      signed_up: true,
      price: 600,
      payment_status: "afventer",
      coach: "Sofie",
    },
    {
      child_id: oscar.id,
      session_date: "2026-08-29",
      weekday: "LØR",
      title: "Champions Cup",
      time: "09:00–14:00",
      location: "Valby Idrætspark",
      type: "event",
      signed_up: false,
      price: 1000,
      capacity: 40,
      coach: "Alle U10–U12 hold",
    },
    {
      child_id: alma.id,
      session_date: "2026-08-29",
      weekday: "LØR",
      title: "Champions Cup",
      time: "09:00–14:00",
      location: "Valby Idrætspark",
      type: "event",
      signed_up: true,
      price: 1000,
      capacity: 40,
      payment_status: "afventer",
      coach: "Alle U10–U12 hold",
    },
  ]);

  console.log("Creating payment history…");
  await supabase.from("payment_history").delete().in("child_id", [oscar.id, alma.id]);
  await supabase.from("payment_history").insert([
    {
      child_id: oscar.id,
      label: "Tirsdagshold · 3 mdr (maj–jul)",
      paid_on: "2026-05-01",
      amount: 3000,
      method: "MobilePay",
    },
    {
      child_id: oscar.id,
      label: "Sommercamp · uge 27",
      paid_on: "2026-06-12",
      amount: 1850,
      method: "MobilePay",
    },
  ]);

  console.log("\nDone.");
  console.log(`Log ind på /login med:\n  email: ${DEMO_EMAIL}\n  kodeord: ${DEMO_PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
