import { mockData } from "../mocks/seedData";
import type { FirePump } from "../types/FirePump";
import type { PumpSwitchRecord } from "../types/PumpSwitchRecord";

const endpoint = "/api/fire-pump";

async function request<T>(url: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url, init);
    if (res.ok) return (await res.json()) as T;
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return fallback as T;
}

export async function listFirePump(): Promise<FirePump[]> {
  return request<FirePump[]>(
    endpoint,
    undefined,
    [...(mockData.firePump as unknown as FirePump[])]
  );
}

export async function rotateFirePump(payload: {
  operator: string;
  note?: string;
}): Promise<{ pumps: FirePump[]; record: PumpSwitchRecord }> {
  return request(`${endpoint}/rotate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function setPumpRepair(payload: {
  pump_id: number;
  repair_status: FirePump["repair_status"];
  repair_note?: string;
}): Promise<FirePump[]> {
  return request(`${endpoint}/repair`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function addPumpHours(payload: {
  pump_id: number;
  hours: number;
}): Promise<FirePump[]> {
  return request(`${endpoint}/hours`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
