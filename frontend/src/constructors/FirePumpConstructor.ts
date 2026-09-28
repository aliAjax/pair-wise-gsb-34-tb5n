import type { FirePump } from "../types/FirePump";

export const createDefaultFirePump = (overrides: Partial<FirePump> = {}): FirePump => ({
  id: 1,
  pump_code: "P-01",
  name: "1# 消防主泵",
  cumulative_hours: 0,
  role: "PRIMARY",
  repair_status: "RUNNABLE",
  repair_note: "",
  last_switched_at: "2026-09-01T09:00:00Z",
  ...overrides
});

export const createFirePumpForm = createDefaultFirePump;
export const createFirePumpResponse = createDefaultFirePump;
