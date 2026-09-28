import type { PumpRole } from "../constants/PumpRole";
import type { MaintenanceStatus } from "../constants/MaintenanceStatus";

// 消防泵房水泵轮换台账
export interface PumpRotation {
  id: number;
  pump_room_id: number;
  pump_room: string;
  device_id: number;
  device_code: string;
  pump_name: string;
  // 累计运行时长（小时）
  cumulative_hours: number;
  // 当前主备：PRIMARY 主泵 / STANDBY 备用泵
  role: PumpRole;
  // 检修状态：RUNNING 运行中 / MAINTENANCE 检修中
  maintenance_status: MaintenanceStatus;
  last_rotated_at: string;
  updated_at: string;
}
