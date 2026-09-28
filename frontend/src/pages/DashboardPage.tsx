import { useEffect } from "react";
import { useFirePumpStore } from "../stores/FirePumpStore";
import { usePumpRotation } from "../hooks/usePumpRotation";
import { StatCard } from "../components/common/StatCard";
import { RotationRiskBanner } from "../components/common/RotationRiskBanner";
import { SwitchRecordTimeline } from "../components/common/SwitchRecordTimeline";
import { PumpRoleBadge } from "../components/common/PumpRoleBadge";
import { PumpRepairStatusTag } from "../components/common/PumpRepairStatusTag";
import { formatHours, formatHourGap } from "../utils/formatters";

export function DashboardPage() {
  const { pumps, records, load } = useFirePumpStore();
  const rotation = usePumpRotation(pumps);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="ledger">
      <div className="page-head">
        <div>
          <p className="eyebrow">fire-inspect / 总览</p>
          <h1>消防合规总览</h1>
        </div>
      </div>

      {/* 两台泵都不能用时，在总览显著标出停供风险 */}
      <RotationRiskBanner pumps={pumps} />

      <div className="metrics">
        <StatCard
          label="当前主泵"
          value={rotation.primary ? rotation.primary.name : "无主泵"}
        />
        <StatCard
          label="主备累计差"
          value={pumps.length ? formatHourGap(rotation.gap) : "—"}
        />
        <StatCard
          label="可用水泵"
          value={pumps.length ? `${rotation.availableCount}/${pumps.length}` : "—"}
        />
      </div>

      <div className="workbench">
        <div className="panel wide">
          <h2>消防泵房状态</h2>
          <div className="table">
            {pumps.map((pump) => (
              <article key={pump.id} className="row">
                <strong>{pump.name}</strong>
                <span>{formatHours(pump.cumulative_hours)}</span>
                <span className="badges">
                  <PumpRoleBadge value={pump.role} />
                  <PumpRepairStatusTag value={pump.repair_status} />
                </span>
              </article>
            ))}
          </div>
          {rotation.rotateDue && !rotation.supplyAtRisk && (
            <p className="hint-warning">{rotation.rotationHint}</p>
          )}
          {rotation.supplyAtRisk && <p className="hint-critical">{rotation.riskHint}</p>}
        </div>

        <div className="panel">
          <h2>最近倒泵记录</h2>
          <SwitchRecordTimeline records={records.slice(0, 3)} pumps={pumps} />
        </div>
      </div>
    </section>
  );
}
