import type { FirePump } from "../types/FirePump";
import type { PumpSwitchRecord } from "../types/PumpSwitchRecord";
import { PUMP_ROTATION_HOURS_LIMIT } from "../constants/pumpRules";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";

/** 轮换业务规则校验错误（携带错误码，供页面按码提示） */
export class PumpRotationError extends Error {
  code: string;
  constructor(code: keyof typeof ERROR_CODES) {
    super(ERROR_MESSAGES[code]);
    this.name = "PumpRotationError";
    this.code = ERROR_CODES[code];
  }
}

export const isRunnable = (pump: FirePump) => pump.repair_status === "RUNNABLE";
export const isPrimary = (pump: FirePump) => pump.role === "PRIMARY";

export const getPrimary = (pumps: FirePump[]) => pumps.find(isPrimary);
export const getStandby = (pumps: FirePump[]) => pumps.find((pump) => pump.role === "STANDBY");

/** 两台泵累计运行时长差值（小时，非负） */
export function getCumulativeGap(pumps: FirePump[]): number {
  if (pumps.length < 2) return 0;
  const hours = pumps.map((pump) => pump.cumulative_hours);
  return Math.abs(hours[0] - hours[1]);
}

/** 累计差是否超过 20 小时阈值（>20 才提示倒泵） */
export function shouldRotate(pumps: FirePump[], limit: number = PUMP_ROTATION_HOURS_LIMIT): boolean {
  return getCumulativeGap(pumps) > limit;
}

/** 两台泵都处于检修、均不可用时判定为停供风险 */
export function isSupplyAtRisk(pumps: FirePump[]): boolean {
  return pumps.length > 0 && pumps.every((pump) => !isRunnable(pump));
}

/**
 * 倒泵目标校验：
 * - 检修中的泵不能设为主泵；
 * - 没有可用备用泵时无法倒泵；
 * - 两台泵都不可用时属于停供风险。
 */
export function assertCanRotate(pumps: FirePump[]): FirePump {
  if (isSupplyAtRisk(pumps)) {
    throw new PumpRotationError("PUMP_SUPPLY_AT_RISK");
  }
  const standby = getStandby(pumps);
  if (!standby || !isRunnable(standby)) {
    throw new PumpRotationError("PUMP_NO_AVAILABLE_STANDBY");
  }
  const primary = getPrimary(pumps);
  if (primary && !isRunnable(primary)) {
    throw new PumpRotationError("PUMP_TARGET_UNDER_REPAIR");
  }
  return standby;
}

/**
 * 设定某台泵为主泵（检修中的泵不允许设为主泵）。
 * 返回新的角色映射，不修改入参。
 */
export function assignPrimary(pumps: FirePump[], newPrimaryId: number): FirePump[] {
  const target = pumps.find((pump) => pump.id === newPrimaryId);
  if (!target || !isRunnable(target)) {
    throw new PumpRotationError("PUMP_TARGET_UNDER_REPAIR");
  }
  return pumps.map((pump) => ({
    ...pump,
    role: pump.id === newPrimaryId ? "PRIMARY" : "STANDBY"
  }));
}

export interface RotationResult {
  pumps: FirePump[];
  record: PumpSwitchRecord;
}

/**
 * 执行倒泵：新主泵确认，旧主泵转备用，并生成切换记录。
 */
export function rotatePumps(
  pumps: FirePump[],
  options: { operator: string; note?: string; switched_at?: string }
): RotationResult {
  const oldPrimary = getPrimary(pumps);
  const standby = assertCanRotate(pumps);
  if (oldPrimary && standby.id === oldPrimary.id) {
    throw new PumpRotationError("VALIDATION_FAILED");
  }
  const switchedAt = options.switched_at ?? new Date().toISOString();
  const nextPumps = pumps.map((pump) => ({
    ...pump,
    role: pump.id === standby.id ? ("PRIMARY" as const) : ("STANDBY" as const),
    last_switched_at: switchedAt
  }));
  const newPrimary = getPrimary(nextPumps);
  const record: PumpSwitchRecord = {
    id: Date.now(),
    switched_at: switchedAt,
    from_pump_id: oldPrimary?.id ?? standby.id,
    to_pump_id: standby.id,
    operator: options.operator,
    from_pump_hours: oldPrimary?.cumulative_hours ?? 0,
    to_pump_hours: standby.cumulative_hours,
    note: options.note ?? LOG_TEMPLATES.PumpSwitch[1],
    confirmed: Boolean(newPrimary && isRunnable(newPrimary))
  };
  return { pumps: nextPumps, record };
}

/** 台账摘要，供设备页和总览页复用 */
export function summarizeRotation(pumps: FirePump[]) {
  const gap = getCumulativeGap(pumps);
  const primary = getPrimary(pumps);
  return {
    primary,
    standby: getStandby(pumps),
    gap,
    limit: PUMP_ROTATION_HOURS_LIMIT,
    rotateDue: shouldRotate(pumps),
    supplyAtRisk: isSupplyAtRisk(pumps),
    availableCount: pumps.filter(isRunnable).length
  };
}
