import { create } from "zustand";
import {
  listPumpRotation,
  listPumpSwitchLog,
  rotatePump,
  setPumpMaintenance,
  registerPumpHours,
  PumpRotationError
} from "../api/PumpRotation";
import type { PumpRotation } from "../types/PumpRotation";
import type { PumpSwitchLog } from "../types/PumpSwitchLog";
import type { RotatePumpPayload } from "../types/pumpRotationPayload";
import { ERROR_CODES } from "../constants/errorCodes";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { createPumpSwitchLog } from "../constructors/PumpRotationConstructor";

type State = {
  rows: PumpRotation[];
  logs: PumpSwitchLog[];
  loading: boolean;
  error: string | null;
  notice: string | null;
  load: () => Promise<void>;
  rotate: (payload: RotatePumpPayload) => Promise<void>;
  setMaintenance: (pumpId: number, status: PumpRotation["maintenance_status"], force?: boolean) => Promise<void>;
  addHours: (pumpId: number, hours: number) => Promise<void>;
  clearError: () => void;
};

const NOW = () => new Date().toISOString();

const clone = (rows: PumpRotation[]) => rows.map((r) => ({ ...r }));

export const usePumpRotationStore = create<State>((set, get) => ({
  rows: [],
  logs: [],
  loading: false,
  error: null,
  notice: null,

  async load(force = false) {
    // 已加载过本地台账时复用内存状态，避免在总览/设备页间切换时被种子数据重置
    if (!force && get().rows.length > 0) {
      if (get().loading) set({ loading: false });
      return;
    }
    set({ loading: true, error: null });
    try {
      const [rows, logs] = await Promise.all([listPumpRotation(), listPumpSwitchLog()]);
      set({ rows, logs, loading: false });
    } catch {
      set({ loading: false, error: "轮换台账加载失败" });
    }
  },

  // 倒泵：确认新主泵投用，旧主泵转备用，并保留切换记录
  async rotate(payload) {
    const rows = clone(get().rows);
    const roomPumps = rows.filter((p) => p.pump_room_id === payload.pump_room_id);
    const target = roomPumps.find((p) => p.id === payload.new_primary_id);
    const oldPrimary = roomPumps.find((p) => p.role === "PRIMARY");

    // 检修中的泵不能设为主泵
    if (!target || target.maintenance_status === "MAINTENANCE") {
      throw new PumpRotationError(ERROR_CODES.PUMP_IN_MAINTENANCE as never);
    }
    // 两台都不能用时无法倒泵
    if (!roomPumps.some((p) => p.maintenance_status === "RUNNING")) {
      throw new PumpRotationError(ERROR_CODES.PUMP_NO_AVAILABLE as never);
    }
    if (!oldPrimary || oldPrimary.id === target.id) return;

    roomPumps.forEach((p) => {
      p.role = p.id === target.id ? "PRIMARY" : "STANDBY";
      p.last_rotated_at = NOW();
      p.updated_at = NOW();
    });

    const log = createPumpSwitchLog({
      id: get().logs.length + 1,
      pump_room_id: oldPrimary.pump_room_id,
      pump_room: oldPrimary.pump_room,
      new_primary_id: target.id,
      new_primary_name: target.pump_name,
      old_primary_id: oldPrimary.id,
      old_primary_name: oldPrimary.pump_name,
      reason: payload.reason ?? "累计运行时长差超过20小时，执行倒泵",
      old_primary_hours: oldPrimary.cumulative_hours,
      new_primary_hours: target.cumulative_hours,
      switched_at: NOW()
    });

    const message = LOG_TEMPLATES.PumpRotation[0]
      .replace("{newPrimary}", target.pump_name)
      .replace("{oldPrimary}", oldPrimary.pump_name);

    set({ rows, logs: [log, ...get().logs], error: null, notice: message });
    void rotatePump(payload).catch(() => undefined);
  },

  // 检修状态变更：主泵检修前必须先倒泵；两台都不可用需二次确认（产生停供风险）
  async setMaintenance(pumpId, status, force = false) {
    const rows = clone(get().rows);
    const pump = rows.find((p) => p.id === pumpId);
    if (!pump) return;

    if (status === "MAINTENANCE") {
      const hasRunningStandby = rows.some(
        (p) => p.id !== pumpId && p.maintenance_status === "RUNNING"
      );
      if (pump.role === "PRIMARY" && hasRunningStandby) {
        throw new PumpRotationError("PUMP_ROTATE_FIRST" as never);
      }
      if (pump.role === "PRIMARY" && !hasRunningStandby && !force) {
        throw new PumpRotationError("PUMP_SUPPLY_RISK_CONFIRM" as never);
      }
    }

    pump.maintenance_status = status;
    pump.updated_at = NOW();

    const message = LOG_TEMPLATES.PumpRotation[1]
      .replace("{pump}", pump.pump_name)
      .replace("{status}", status === "MAINTENANCE" ? "检修中" : "运行中");

    set({ rows, error: null, notice: message });
    void setPumpMaintenance({ pump_id: pumpId, maintenance_status: status }).catch(() => undefined);
  },

  // 登记累计运行时长（主泵运行）
  async addHours(pumpId, hours) {
    const rows = clone(get().rows);
    const pump = rows.find((p) => p.id === pumpId);
    if (!pump) return;
    pump.cumulative_hours = Number((pump.cumulative_hours + hours).toFixed(1));
    pump.updated_at = NOW();

    const message = LOG_TEMPLATES.PumpRotation[2]
      .replace("{pump}", pump.pump_name)
      .replace("{hours}", String(hours));

    set({ rows, error: null, notice: message });
    void registerPumpHours(pumpId, hours).catch(() => undefined);
  },

  clearError() {
    set({ error: null });
  }
}));
