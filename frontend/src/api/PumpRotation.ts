import { mockData } from "../mocks/seedData";
import type { PumpRotation } from "../types/PumpRotation";
import type { PumpSwitchLog } from "../types/PumpSwitchLog";
import type { RotatePumpPayload, SetMaintenancePayload } from "../types/pumpRotationPayload";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const endpoint = "/api/pump-rotation";

export class PumpRotationError extends Error {
  code: string;
  constructor(code: keyof typeof ERROR_CODES) {
    super(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.VALIDATION_FAILED);
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const res = await fetch(endpoint + path, init);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const code = body?.code ?? "VALIDATION_FAILED";
      throw new PumpRotationError(code as keyof typeof ERROR_CODES);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof PumpRotationError) throw err;
    // Local mock fallback keeps the UI available during offline review.
  }
  return fallback as T;
}

export async function listPumpRotation(): Promise<PumpRotation[]> {
  return request<PumpRotation[]>("", undefined, [
    ...(mockData.pumpRotation as unknown as PumpRotation[])
  ]);
}

export async function listPumpSwitchLog(pumpRoomId?: number): Promise<PumpSwitchLog[]> {
  const rows = mockData.pumpSwitchLog as unknown as PumpSwitchLog[];
  return request<PumpSwitchLog[]>(
    pumpRoomId ? `/logs?pump_room_id=${pumpRoomId}` : "/logs",
    undefined,
    pumpRoomId ? rows.filter((r) => r.pump_room_id === pumpRoomId) : [...rows]
  );
}

export async function rotatePump(payload: RotatePumpPayload): Promise<PumpRotation[]> {
  return request<PumpRotation[]>(
    "/rotate",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    },
    [...(mockData.pumpRotation as unknown as PumpRotation[])]
  );
}

export async function setPumpMaintenance(payload: SetMaintenancePayload): Promise<PumpRotation[]> {
  return request<PumpRotation[]>(
    "/maintenance",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    },
    [...(mockData.pumpRotation as unknown as PumpRotation[])]
  );
}

export async function registerPumpHours(pumpId: number, hours: number): Promise<PumpRotation[]> {
  return request<PumpRotation[]>(
    "/hours",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pump_id: pumpId, hours })
    },
    [...(mockData.pumpRotation as unknown as PumpRotation[])]
  );
}
