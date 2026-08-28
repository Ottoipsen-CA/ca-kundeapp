// Hand-written to match supabase/migrations/0001_init.sql. If the schema
// changes, regenerate with:
//   npx supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type BillingKind = "recurring" | "recurring-promo" | "per-session";
export type PaymentStatusDb = "betalt" | "afventer" | "gratis";
export type SessionTypeDb = "training" | "event";
export type BadgeKindDb = "number" | "check" | "text";
export type ApplicationStatus = "ny" | "kontaktet" | "optaget" | "afvist";

export type Database = {
  public: {
    Tables: {
      parents: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parents"]["Insert"]>;
      };
      children: {
        Row: {
          id: string;
          parent_id: string | null;
          name: string;
          initials: string;
          age_group: string;
          position: string | null;
          club: string | null;
          streak_weeks: number;
          attendance_pct: number;
          sessions_count: number;
          technique_score: number;
          technique_delta: number;
          tactics_score: number;
          tactics_delta: number;
          physical_score: number;
          physical_delta: number;
          development_history: number[];
          development_months: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["children"]["Row"]> & {
          name: string;
          initials: string;
          age_group: string;
        };
        Update: Partial<Database["public"]["Tables"]["children"]["Row"]>;
      };
      badges: {
        Row: {
          id: string;
          child_id: string;
          key: string;
          label: string;
          kind: BadgeKindDb;
          value: string;
          unlocked: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["badges"]["Row"]> & {
          child_id: string;
          key: string;
          label: string;
          kind: BadgeKindDb;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Row"]>;
      };
      teams: {
        Row: {
          id: string;
          name: string;
          weekday: string;
          time: string;
          location: string;
          coach: string | null;
          billing_kind: BillingKind;
          price_per_month: number | null;
          cycle_months: number | null;
          free_until: string | null;
          price_per_session: number | null;
          frequency: string | null;
        };
        Insert: Database["public"]["Tables"]["teams"]["Row"];
        Update: Partial<Database["public"]["Tables"]["teams"]["Row"]>;
      };
      enrollments: {
        Row: {
          id: string;
          child_id: string;
          team_id: string;
          cycle_start: string;
          cycle_end: string;
          status: PaymentStatusDb;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["enrollments"]["Row"]> & {
          child_id: string;
          team_id: string;
          cycle_start: string;
          cycle_end: string;
          status: PaymentStatusDb;
        };
        Update: Partial<Database["public"]["Tables"]["enrollments"]["Row"]>;
      };
      sessions: {
        Row: {
          id: string;
          child_id: string;
          team_id: string | null;
          session_date: string;
          weekday: string;
          title: string;
          time: string;
          location: string;
          type: SessionTypeDb;
          signed_up: boolean;
          price: number | null;
          payment_status: PaymentStatusDb | null;
          capacity: number | null;
          coach: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sessions"]["Row"]> & {
          child_id: string;
          session_date: string;
          weekday: string;
          title: string;
          time: string;
          location: string;
          type: SessionTypeDb;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Row"]>;
      };
      payment_history: {
        Row: {
          id: string;
          child_id: string;
          label: string;
          paid_on: string;
          amount: number;
          method: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["payment_history"]["Row"]> & {
          child_id: string;
          label: string;
          paid_on: string;
          amount: number;
          method: string;
        };
        Update: Partial<Database["public"]["Tables"]["payment_history"]["Row"]>;
      };
      applications: {
        Row: {
          id: string;
          player_name: string;
          birth_year: string;
          current_club: string | null;
          parent_email: string | null;
          parent_phone: string | null;
          status: ApplicationStatus;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["applications"]["Row"]> & {
          player_name: string;
          birth_year: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Row"]>;
      };
    };
    Functions: {
      toggle_session_signup: {
        Args: { p_session_id: string };
        Returns: Database["public"]["Tables"]["sessions"]["Row"];
      };
    };
  };
};
