export const PumpRepairStatus = ["RUNNABLE", "UNDER_REPAIR"] as const;
export type PumpRepairStatus = (typeof PumpRepairStatus)[number];
export const PumpRepairStatusText: Record<PumpRepairStatus, string> = {
  RUNNABLE: "可用",
  UNDER_REPAIR: "检修中"
};
