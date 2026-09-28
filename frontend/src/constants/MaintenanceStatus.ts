export const MaintenanceStatus = ["RUNNING", "MAINTENANCE"] as const;
export type MaintenanceStatus = (typeof MaintenanceStatus)[number];
export const MaintenanceStatusText: Record<MaintenanceStatus, string> = {
  RUNNING: "运行中",
  MAINTENANCE: "检修中"
};
