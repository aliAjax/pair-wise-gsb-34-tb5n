export const PumpRole = ["PRIMARY", "STANDBY"] as const;
export type PumpRole = (typeof PumpRole)[number];
export const PumpRoleText: Record<PumpRole, string> = {
  PRIMARY: "主泵",
  STANDBY: "备用泵"
};
