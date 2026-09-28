import { useEffect, useState } from "react";
import { useFirePumpStore } from "../stores/FirePumpStore";
import { usePumpRotation } from "../hooks/usePumpRotation";
import { PumpRoleBadge } from "../components/common/PumpRoleBadge";
import { PumpRepairStatusTag } from "../components/common/PumpRepairStatusTag";
import { RotationRiskBanner } from "../components/common/RotationRiskBanner";
import { SwitchRecordTimeline } from "../components/common/SwitchRecordTimeline";
import { formatHours, formatHourGap, formatDate } from "../utils/formatters";
import type { FirePump } from "../types/FirePump";

function PumpRow({
  pump,
  onToggleRepair,
  onAddHours
}: {
  pump: FirePump;
  onToggleRepair: (pump: FirePump) => void;
  onAddHours: (pump: FirePump) => void;
}) {
  return (
    <article className={"pump-card " + (pump.repair_status === "UNDER_REPAIR" ? "is-repair" : "")}>
      <header className="pump-card-head">
        <div>
          <strong>{pump.name}</strong>
          <span className="pump-code">{pump.pump_code}</span>
        </div>
        <div className="badges">
          <PumpRoleBadge value={pump.role} />
          <PumpRepairStatusTag value={pump.repair_status} />
        </div>
      </header>
      <dl className="pump-metrics">
        <div>
          <dt>累计运行时长</dt>
          <dd>{formatHours(pump.cumulative_hours)}</dd>
        </div>
        <div>
          <dt>最近倒泵</dt>
          <dd>{formatDate(pump.last_switched_at)}</dd>
        </div>
      </dl>
      {pump.repair_status === "UNDER_REPAIR" && (
        <p className="repair-note">检修备注：{pump.repair_note || "检修中，暂不可用"}</p>
      )}
      <footer className="pump-actions">
        <button
          type="button"
          className="btn"
          onClick={() => onToggleRepair(pump)}
        >
          {pump.repair_status === "UNDER_REPAIR" ? "完成检修" : "送修"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onAddHours(pump)}>
          模拟运行 +2h
        </button>
      </footer>
    </article>
  );
}

export function DevicesPage() {
  const { pumps, records, loading, error, load, rotate, setRepair, addHours, clearError } =
    useFirePumpStore();
  const rotation = usePumpRotation(pumps);
  const [operator] = useState("值班工程师");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setConfirmed(false);
  }, [pumps, records]);

  const handleRotate = async () => {
    // 倒泵后需确认新主泵；确认前先执行切换
    if (!confirmed) return;
    const ok = await rotate(operator);
    if (ok) setConfirmed(false);
  };

  const handleToggleRepair = (pump: FirePump) => {
    if (pump.repair_status === "UNDER_REPAIR") {
      setRepair(pump.id, "RUNNABLE", "");
    } else {
      const note = window.prompt(`将「${pump.name}」送修，请填写检修内容：`, "计划性检修");
      setRepair(pump.id, "UNDER_REPAIR", note ?? "");
    }
  };

  return (
    <section className="ledger">
      <div className="page-head">
        <div>
          <p className="eyebrow">fire-inspect / 消防泵房</p>
          <h1>消防设备台账 · 水泵轮换</h1>
          <p className="sub">记录每台泵累计运行时长、当前主备与检修状态，累计差超过 20 小时提示倒泵。</p>
        </div>
      </div>

      <RotationRiskBanner pumps={pumps} />

      {error && (
        <div className="alert alert-error" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-ghost" onClick={clearError}>
            知道了
          </button>
        </div>
      )}

      <div className="metrics">
        <div className="stat">
          <span>当前主泵</span>
          <strong>{rotation.primary?.name ?? "—"}</strong>
        </div>
        <div className="stat">
          <span>累计时长差</span>
          <strong className={rotation.rotateDue ? "text-warning" : ""}>
            {formatHourGap(rotation.gap)}
          </strong>
        </div>
        <div className="stat">
          <span>可用水泵</span>
          <strong className={rotation.supplyAtRisk ? "text-critical" : ""}>
            {rotation.availableCount} / {pumps.length}
          </strong>
        </div>
      </div>

      <div className="workbench">
        <div className="panel wide">
          <div className="panel-head">
            <h2>轮换台账</h2>
            <div className="rotate-box">
              <label className="confirm-line">
                <input
                  type="checkbox"
                  checked={confirmed}
                  disabled={!rotation.rotateDue || rotation.supplyAtRisk}
                  onChange={(e) => setConfirmed(e.target.checked)}
                />
                倒泵后已确认新主泵运行，旧主泵转备用
              </label>
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  loading ||
                  !rotation.rotateDue ||
                  rotation.supplyAtRisk ||
                  !confirmed
                }
                onClick={handleRotate}
              >
                执行倒泵
              </button>
            </div>
          </div>

          {loading ? (
            <div className="empty">加载中…</div>
          ) : (
            <div className="pump-grid">
              {pumps.map((pump) => (
                <PumpRow
                  key={pump.id}
                  pump={pump}
                  onToggleRepair={handleToggleRepair}
                  onAddHours={(p) => void addHours(p.id, 2)}
                />
              ))}
            </div>
          )}

          {rotation.rotateDue && !rotation.supplyAtRisk && (
            <p className="hint-warning">
              {rotation.rotationHint}。检修中的泵不能设为主泵。
            </p>
          )}
        </div>

        <div className="panel">
          <h2>倒泵切换记录</h2>
          <SwitchRecordTimeline records={records} pumps={pumps} />
        </div>
      </div>
    </section>
  );
}
