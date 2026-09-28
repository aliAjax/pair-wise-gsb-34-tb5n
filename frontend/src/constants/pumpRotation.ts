// 消防水泵轮换业务阈值与判定规则（前后端同名模块保持一致）
export const PUMP_ROTATION_HOUR_GAP = 20;

export type PumpRuntime = {
  id: number;
  pump_room: string;
  role: string;
  maintenance_status: string;
  cumulative_hours: number;
};

// 累计运行时长差（绝对值），单位小时
export function calcRuntimeGap(pumps: Pick<PumpRuntime, "cumulative_hours">[]): number {
  if (pumps.length < 2) return 0;
  const hours = pumps.map((p) => Number(p.cumulative_hours) || 0);
  return Math.max(...hours) - Math.min(...hours);
}

// 累计差超过 20 小时，提示倒泵
export function shouldRotatePump(pumps: Pick<PumpRuntime, "cumulative_hours">[]): boolean {
  return calcRuntimeGap(pumps) > PUMP_ROTATION_HOUR_GAP;
}

// 检修中（非 RUNNING）即视为不可用
export function isPumpAvailable(pump: Pick<PumpRuntime, "maintenance_status">): boolean {
  return pump.maintenance_status === "RUNNING";
}

// 两台都不能用（均在检修）→ 停供风险
export function hasSupplyRisk(pumps: Pick<PumpRuntime, "maintenance_status">[]): boolean {
  return pumps.length > 0 && pumps.every((p) => !isPumpAvailable(p));
}
