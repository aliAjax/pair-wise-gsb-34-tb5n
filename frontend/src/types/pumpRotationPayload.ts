// 一次倒泵动作的入参
export interface RotatePumpPayload {
  pump_room_id: number;
  new_primary_id: number;
  operator_id?: number;
  reason?: string;
}

// 检修状态变更入参
export interface SetMaintenancePayload {
  pump_id: number;
  maintenance_status: "RUNNING" | "MAINTENANCE";
  operator_id?: number;
}
