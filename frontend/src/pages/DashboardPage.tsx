import { useEffect } from "react";
import { usePumpRotationStore } from "../stores/PumpRotationStore";
import { usePumpRotation } from "../hooks/usePumpRotation";
import { SupplyRiskBanner } from "../components/common/SupplyRiskBanner";
import { StatCard } from "../components/common/StatCard";
import { formatHours } from "../utils/formatters";

export function DashboardPage() {
  const { rows, load } = usePumpRotationStore();
  const { rooms, anySupplyRisk, riskRooms } = usePumpRotation(rows);

  useEffect(() => {
    void load();
  }, [load]);

  const needRotateRooms = rooms.filter((r) => r.needRotate && !r.supplyRisk);
  const maxGap = rooms.reduce((max, r) => Math.max(max, r.gap), 0);

  return (
    <section className="page-inner">
      <header className="page-head">
        <div>
          <p className="eyebrow">fire-inspect / dashboard</p>
          <h1>消防合规总览</h1>
          <p className="subtitle">汇总消防泵房供用水风险、水泵轮换与设备状态。</p>
        </div>
      </header>

      <SupplyRiskBanner
        risk={anySupplyRisk}
        rooms={riskRooms}
        detail="请立即安排检修恢复供水，期间禁止联动停用消防泵组。"
      />

      <section className="metrics">
        <StatCard label="在册消防泵房" value={rooms.length} />
        <StatCard label="待倒泵泵房" value={needRotateRooms.length} />
        <StatCard label="最大累计时长差" value={formatHours(maxGap)} />
      </section>

      <div className="panel wide">
        <h2>消防泵房轮换概览</h2>
        {rooms.length === 0 ? (
          <p className="empty">暂无泵房数据</p>
        ) : (
          <div className="table">
            {rooms.map((room) => (
              <article key={room.roomId} className="row">
                <strong>{room.roomName}</strong>
                <span>
                  {room.supplyRisk
                    ? "停供风险"
                    : room.needRotate
                      ? "累计差超限，待倒泵"
                      : "运行正常"}
                </span>
                <span className={room.supplyRisk || room.needRotate ? "text-warn" : ""}>
                  差 {formatHours(room.gap)} / 可用 {room.availableCount}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
