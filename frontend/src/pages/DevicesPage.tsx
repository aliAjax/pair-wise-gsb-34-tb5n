import { useEffect, useState } from "react";
import { usePumpRotationStore } from "../stores/PumpRotationStore";
import { usePumpRotation } from "../hooks/usePumpRotation";
import { PumpRotationError } from "../api/PumpRotation";
import type { PumpRotation } from "../types/PumpRotation";
import { SupplyRiskBanner } from "../components/common/SupplyRiskBanner";
import { PumpRotationRoomCard } from "../components/devices/PumpRotationRoomCard";

export function DevicesPage() {
  const { rows, logs, loading, error, notice, load, rotate, setMaintenance, addHours, clearError } =
    usePumpRotationStore();
  const { rooms, anySupplyRisk, riskRooms } = usePumpRotation(rows);
  const [pendingRotate, setPendingRotate] = useState<PumpRotation | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!pendingRotate) return;
    // 倒泵目标若已变为检修或主泵，撤销待确认
    const still = rows.find((r) => r.id === pendingRotate.id);
    if (!still || still.role === "PRIMARY" || still.maintenance_status === "MAINTENANCE") {
      setPendingRotate(null);
    }
  }, [rows, pendingRotate]);

  const guard = (err: unknown) => {
    if (err instanceof PumpRotationError) setLocalError(err.message);
    else setLocalError("操作失败，请重试");
  };

  const askRotate = (pump: PumpRotation) => {
    setLocalError(null);
    setPendingRotate(pump);
  };

  const confirmRotate = async () => {
    if (!pendingRotate) return;
    try {
      await rotate({ pump_room_id: pendingRotate.pump_room_id, new_primary_id: pendingRotate.id });
      setPendingRotate(null);
    } catch (err) {
      guard(err);
    }
  };

  const toggleMaintenance = async (pump: PumpRotation) => {
    setLocalError(null);
    const next = pump.maintenance_status === "MAINTENANCE" ? "RUNNING" : "MAINTENANCE";
    try {
      await setMaintenance(pump.id, next);
    } catch (err) {
      if (err instanceof PumpRotationError && err.code === "PUMP_SUPPLY_RISK_CONFIRM") {
        const ok = window.confirm(`${err.message}。是否仍要将 ${pump.pump_name} 置为检修中？`);
        if (ok) {
          try {
            await setMaintenance(pump.id, next, true);
          } catch (retryErr) {
            guard(retryErr);
          }
        }
        return;
      }
      guard(err);
    }
  };

  const shownError = localError ?? error;

  return (
    <section className="page-inner">
      <header className="page-head">
        <div>
          <p className="eyebrow">fire-inspect / devices</p>
          <h1>消防设备台账</h1>
          <p className="subtitle">消防泵房主备水泵轮换台账：累计运行时长、主备与检修状态、倒泵记录。</p>
        </div>
      </header>

      <SupplyRiskBanner risk={anySupplyRisk} rooms={riskRooms} />

      {shownError ? (
        <div className="alert error" onClick={() => { setLocalError(null); clearError(); }}>
          {shownError}（点击关闭）
        </div>
      ) : null}
      {notice && !shownError ? <div className="alert info">{notice}</div> : null}

      {loading ? (
        <div className="panel">轮换台账加载中…</div>
      ) : (
        <div className="pump-rooms">
          {rooms.map((room) => (
            <PumpRotationRoomCard
              key={room.roomId}
              room={room}
              logs={logs}
              onRotate={askRotate}
              onConfirmRotate={() => void confirmRotate()}
              pendingRotate={pendingRotate}
              onCancelRotate={() => setPendingRotate(null)}
              onToggleMaintenance={(p) => void toggleMaintenance(p)}
              onAddHours={(p) => void addHours(p.id, 1)}
            />
          ))}
          {rooms.length === 0 ? <div className="panel empty">暂无水泵轮换台账数据</div> : null}
        </div>
      )}
    </section>
  );
}
