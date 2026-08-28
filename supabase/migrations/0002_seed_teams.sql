-- Reference data: the three real teams. Safe to re-run.
insert into teams (id, name, weekday, time, location, coach, billing_kind, price_per_month, cycle_months, free_until, price_per_session, frequency)
values
  ('tirsdag', 'Tirsdagshold', 'TIR', '17:00–18:15', 'Fælledparken', 'Mikkel', 'recurring', 1000, 3, null, null, null),
  ('fredag-bk-union', 'Fredag · BK Union', 'FRE', '16:30–17:45', 'Kløvermarken, bane 4', 'Mikkel', 'recurring-promo', 500, 3.5, '2026-09-18', null, null),
  ('soendag-workshop', 'Søndag Workshop', 'SØN', '10:00–12:00', 'Valby Idrætspark', 'Sofie', 'per-session', null, null, null, 600, '1× om måneden')
on conflict (id) do update set
  name = excluded.name,
  weekday = excluded.weekday,
  time = excluded.time,
  location = excluded.location,
  coach = excluded.coach,
  billing_kind = excluded.billing_kind,
  price_per_month = excluded.price_per_month,
  cycle_months = excluded.cycle_months,
  free_until = excluded.free_until,
  price_per_session = excluded.price_per_session,
  frequency = excluded.frequency;
