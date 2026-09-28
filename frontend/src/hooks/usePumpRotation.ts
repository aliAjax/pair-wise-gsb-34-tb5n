import { useMemo } from "react";
import type { FirePump } from "../types/FirePump";
import {
  summarizeRotation,
  type PumpRotationError
} from "../utils/pumpRotation";
import { PUMP_ROTATION_HOURS_LIMIT } from "../constants/pumpRules";

/**
 * 汇总消防泵房轮换状态：累计差、倒泵提示、停供风险。
 * 供设备台账页和消防合规总览页共用。
 */
export function usePumpRotation(pumps: FirePump[] = []) {
  return useMemo(() => {
    const summary = summarizeRotation(pumps);
    return {
      ...summary,
      threshold: PUMP_ROTATION_HOURS_LIMIT,
      /** 倒泵提示文案 */
      rotationHint: summary.rotateDue
        ? `主备泵累计运行时长相差 ${summary.gap.toFixed(1)} 小时，已超过 ${PUMP_ROTATION_HOURS_LIMIT} 小时，请尽快倒泵`
        : `累计时长差 ${summary.gap.toFixed(1)} 小时，暂不需要倒泵`,
      /** 停供风险提示文案 */
      riskHint: summary.supplyAtRisk
        ? "两台水泵均不可用，消防供水中断，存在停供风险"
        : "供水正常"
    };
  }, [pumps]);
}

export type { PumpRotationError };
