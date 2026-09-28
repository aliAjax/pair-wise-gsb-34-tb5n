import { create } from "zustand";
import {
  listFirePump,
  rotateFirePump,
  setPumpRepair,
  addPumpHours
} from "../api/FirePump";
import { listPumpSwitchRecord } from "../api/PumpSwitchRecord";
import type { FirePump } from "../types/FirePump";
import type { PumpSwitchRecord } from "../types/PumpSwitchRecord";
import {
  rotatePumps,
  assignPrimary,
  PumpRotationError,
  isRunnable,
  getPrimary
} from "../utils/pumpRotation";

type State = {
  pumps: FirePump[];
  records: PumpSwitchRecord[];
  loading: boolean;
  /** 最近一次轮换规则错误（携带错误码） */
  error: string | null;
  load: () => Promise<void>;
  rotate: (operator: string) => Promise<boolean>;
  setRepair: (pumpId: number, repair: FirePump["repair_status"], note?: string) => boolean;
  addHours: (pumpId: number, hours: number) => Promise<void>;
  clearError: () => void;
};

/** 离线评审时对本地副本执行倒泵；与后端规则保持一致 */
function localRotate(pumps: FirePump[], operator: string) {
  return rotatePumps(pumps, { operator });
}

export const useFirePumpStore = create<State>((set, get) => ({
  pumps: [],
  records: [],
  loading: false,
  error: null,

  async load() {
    set({ loading: true });
    const [pumps, records] = await Promise.all([
      listFirePump(),
      listPumpSwitchRecord()
    ]);
    set({ pumps, records, loading: false, error: null });
  },

  async rotate(operator: string) {
    const { pumps, records } = get();
    try {
      // 先在前端做规则校验，检修泵/停供场景直接拦截
      const local = localRotate(pumps, operator);
      const res = await rotateFirePump({ operator });
      if (res && res.pumps && res.record) {
        set({ pumps: res.pumps, records: [res.record, ...records], error: null });
      } else {
        set({
          pumps: local.pumps,
          records: [local.record, ...records],
          error: null
        });
      }
      return true;
    } catch (err) {
      set({ error: err instanceof PumpRotationError ? err.message : "倒泵失败，请重试" });
      return false;
    }
  },

  setRepair(pumpId, repair, note) {
    const { pumps } = get();
    const target = pumps.find((pump) => pump.id === pumpId);
    if (!target) return false;
    // 检修中的泵不能设为主泵：若把当前主泵送修，则尝试自动切到可用备用泵
    let next = pumps.map((pump) =>
      pump.id === pumpId
        ? { ...pump, repair_status: repair, repair_note: note ?? pump.repair_note }
        : pump
    );
    const primary = getPrimary(next);
    if (repair === "UNDER_REPAIR" && primary?.id === pumpId) {
      const fallback = next.find((pump) => pump.id !== pumpId && isRunnable(pump));
      if (!fallback) {
        // 两台都不可用：允许送修，由总览页标出停供风险
        next = next.map((pump) => (pump.id === pumpId ? { ...pump, role: "STANDBY" } : pump));
      } else {
        next = assignPrimary(next, fallback.id);
      }
    } else if (repair === "RUNNABLE") {
      // 检修完成：当前没有可用主泵时，恢复的泵自动补为主泵
      const hasRunnablePrimary = Boolean(primary && isRunnable(primary));
      if (!hasRunnablePrimary) {
        next = assignPrimary(next, pumpId);
      }
    }
    set({ pumps: next, error: null });
    void setPumpRepair({ pump_id: pumpId, repair_status: repair, repair_note: note });
    return true;
  },

  async addHours(pumpId, hours) {
    const { pumps } = get();
    set({
      pumps: pumps.map((pump) =>
        pump.id === pumpId ? { ...pump, cumulative_hours: pump.cumulative_hours + hours } : pump
      )
    });
    void addPumpHours({ pump_id: pumpId, hours });
  },

  clearError() {
    set({ error: null });
  }
}));
