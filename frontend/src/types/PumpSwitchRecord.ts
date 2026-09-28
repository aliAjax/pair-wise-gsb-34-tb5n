import type { PumpRole } from "./PumpRole";

/** 主备泵倒泵切换记录（保留切换台账） */
export interface PumpSwitchRecord {
  id: number;
  /** 倒泵时间 ISO 字符串 */
  switched_at: string;
  /** 倒泵前的主泵 id */
  from_pump_id: number;
  /** 倒泵后的新主泵 id */
  to_pump_id: number;
  /** 操作人 */
  operator: string;
  /** 切换时两泵累计时长（小时），便于台账追溯 */
  from_pump_hours: number;
  to_pump_hours: number;
  /** 操作结果描述，如“新主泵已确认” */
  note: string;
  /** 新主泵确认标记 */
  confirmed: boolean;
  /** 仅用于前端展示，可空 */
  new_role?: PumpRole;
}
