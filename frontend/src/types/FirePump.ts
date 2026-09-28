import type { PumpRole } from "./PumpRole";
import type { PumpRepairStatus } from "./PumpRepairStatus";

/** 消防水泵（消防泵房轮换台账） */
export interface FirePump {
  id: number;
  pump_code: string;
  name: string;
  /** 累计运行时长，单位：小时 */
  cumulative_hours: number;
  /** 当前主备角色 */
  role: PumpRole;
  /** 检修状态 */
  repair_status: PumpRepairStatus;
  /** 检修备注（送修原因 / 检修内容） */
  repair_note: string;
  last_switched_at: string;
}
