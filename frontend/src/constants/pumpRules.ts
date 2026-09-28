/**
 * 消防泵房轮换规则常量。
 * 累计运行时长差值（小时）超过该阈值即提示倒泵。
 */
export const PUMP_ROTATION_HOURS_LIMIT = 20;

export const PUMP_ROTATION = {
  /** 累计时长差阈值（小时），> 该值提示倒泵 */
  hoursLimit: PUMP_ROTATION_HOURS_LIMIT,
  /** 停供风险等级文案 */
  supplyRiskLevel: "CRITICAL",
  /** 倒泵后新主泵确认台账状态 */
  confirmedNote: "新主泵已确认，旧主泵转备用"
} as const;
