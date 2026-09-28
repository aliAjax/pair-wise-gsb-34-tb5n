import { formatDate } from "../../utils/formatters";
import type { FirePump } from "../../types/FirePump";
import type { PumpSwitchRecord } from "../../types/PumpSwitchRecord";

/** 倒泵切换记录时间线（设备台账 / 总览共用） */
export function SwitchRecordTimeline({
  records,
  pumps
}: {
  records: PumpSwitchRecord[];
  pumps: FirePump[];
}) {
  const nameOf = (id: number) => pumps.find((pump) => pump.id === id)?.name ?? `#${id}`;
  if (records.length === 0) {
    return <div className="empty">暂无倒泵切换记录</div>;
  }
  return (
    <ol className="timeline">
      {records.map((record) => (
        <li key={record.id} className="timeline-item">
          <div className="timeline-head">
            <strong>
              {nameOf(record.from_pump_id)} → {nameOf(record.to_pump_id)}
            </strong>
            <time>{formatDate(record.switched_at)}</time>
          </div>
          <p>
            旧主泵转备用，新主泵
            {record.confirmed ? "已确认运行" : "待确认"}；操作人：{record.operator}
          </p>
          <p className="timeline-note">{record.note}</p>
        </li>
      ))}
    </ol>
  );
}
