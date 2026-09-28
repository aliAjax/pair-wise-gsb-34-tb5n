import type { PumpRotation } from "../types/PumpRotation";
import type { PumpSwitchLog } from "../types/PumpSwitchLog";

const NOW = "2026-09-28T08:00:00Z";

// 默认水泵轮换台账行
export const createDefaultPumpRotation = (overrides: Partial<PumpRotation> = {}): PumpRotation => ({
  id: 1,
  pump_room_id: 1,
  pump_room: "1号消防泵房",
  device_id: 101,
  device_code: "FP-001",
  pump_name: "1号泵",
  cumulative_hours: 0,
  role: "STANDBY",
  maintenance_status: "RUNNING",
  last_rotated_at: NOW,
  updated_at: NOW,
  ...overrides
});

export const createPumpRotationForm = createDefaultPumpRotation;
export const createPumpRotationResponse = createDefaultPumpRotation;

// 构造一条倒泵切换记录
export const createPumpSwitchLog = (overrides: Partial<PumpSwitchLog> = {}): PumpSwitchLog => ({
  id: 1,
  pump_room_id: 1,
  pump_room: "1号消防泵房",
  new_primary_id: 2,
  new_primary_name: "2号泵",
  old_primary_id: 1,
  old_primary_name: "1号泵",
  operator_id: 1,
  reason: "累计运行时长差超过20小时，例行倒泵",
  old_primary_hours: 0,
  new_primary_hours: 0,
  switched_at: NOW,
  ...overrides
});
