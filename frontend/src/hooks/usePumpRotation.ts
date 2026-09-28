import { useMemo } from "react";
import type { PumpRotation } from "../types/PumpRotation";
import {
  calcRuntimeGap,
  hasSupplyRisk,
  isPumpAvailable,
  shouldRotatePump,
  PUMP_ROTATION_HOUR_GAP
} from "../constants/pumpRotation";

// 按泵房分组的轮换台账派生数据
export function usePumpRotation(rows: PumpRotation[]) {
  return useMemo(() => {
    const roomIds = Array.from(new Set(rows.map((r) => r.pump_room_id)));
    const rooms = roomIds.map((roomId) => {
      const pumps = rows.filter((r) => r.pump_room_id === roomId);
      const primary = pumps.find((p) => p.role === "PRIMARY");
      const gap = calcRuntimeGap(pumps);
      const rotate = shouldRotatePump(pumps);
      const risk = hasSupplyRisk(pumps);
      const availableCount = pumps.filter(isPumpAvailable).length;
      // 建议倒向：当前可用的备用泵
      const standbyTarget = pumps.find(
        (p) => p.role === "STANDBY" && isPumpAvailable(p)
      );
      return {
        roomId,
        roomName: pumps[0]?.pump_room ?? `泵房${roomId}`,
        pumps,
        primary,
        gap,
        threshold: PUMP_ROTATION_HOUR_GAP,
        needRotate: rotate,
        supplyRisk: risk,
        availableCount,
        standbyTarget
      };
    });

    const anySupplyRisk = rooms.some((r) => r.supplyRisk);
    const riskRooms = rooms.filter((r) => r.supplyRisk).map((r) => r.roomName);

    return { rooms, anySupplyRisk, riskRooms };
  }, [rows]);
}
