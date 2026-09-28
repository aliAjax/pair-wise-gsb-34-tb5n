import { mockData } from "../mocks/seedData";
import type { PumpSwitchRecord } from "../types/PumpSwitchRecord";

const endpoint = "/api/pump-switch";

export async function listPumpSwitchRecord(): Promise<PumpSwitchRecord[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return [...(mockData.pumpSwitch as unknown as PumpSwitchRecord[])].sort(
    (a, b) => +new Date(b.switched_at) - +new Date(a.switched_at)
  );
}

export async function savePumpSwitchRecord(payload: PumpSwitchRecord) {
  console.info("save PumpSwitchRecord", payload);
  return payload;
}
