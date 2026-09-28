import type { PumpSwitchRecord } from "../types/PumpSwitchRecord";

export const createDefaultPumpSwitchRecord = (
  overrides: Partial<PumpSwitchRecord> = {}
): PumpSwitchRecord => ({
  id: 1,
  switched_at: "2026-09-01T09:00:00Z",
  from_pump_id: 2,
  to_pump_id: 1,
  operator: "值班工程师",
  from_pump_hours: 0,
  to_pump_hours: 0,
  note: "新主泵已确认，旧主泵转备用",
  confirmed: true,
  ...overrides
});

export const createPumpSwitchForm = createDefaultPumpSwitchRecord;
export const createPumpSwitchResponse = createDefaultPumpSwitchRecord;
