// 水泵倒泵（主备切换）记录，永久保留
export interface PumpSwitchLog {
  id: number;
  pump_room_id: number;
  pump_room: string;
  // 倒泵后确认的新主泵
  new_primary_id: number;
  new_primary_name: string;
  // 旧主泵转备用
  old_primary_id: number;
  old_primary_name: string;
  operator_id: number;
  reason: string;
  // 切换瞬间两泵累计运行时长（小时）
  old_primary_hours: number;
  new_primary_hours: number;
  switched_at: string;
}
