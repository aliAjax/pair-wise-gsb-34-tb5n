import { create } from "zustand";
import { listPumpSwitchRecord } from "../api/PumpSwitchRecord";
import type { PumpSwitchRecord } from "../types/PumpSwitchRecord";

type State = {
  rows: PumpSwitchRecord[];
  loading: boolean;
  load: () => Promise<void>;
  prepend: (record: PumpSwitchRecord) => void;
};

export const usePumpSwitchStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load() {
    set({ loading: true });
    set({ rows: await listPumpSwitchRecord(), loading: false });
  },
  prepend(record) {
    set((state) => ({ rows: [record, ...state.rows] }));
  }
}));
