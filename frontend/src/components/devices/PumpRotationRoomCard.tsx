import { useState } from "react";
import type { PumpRotation } from "../../types/PumpRotation";
import type { PumpSwitchLog } from "../../types/PumpSwitchLog";
import { PumpRoleText } from "../../constants/PumpRole";
import { MaintenanceStatusText } from "../../constants/MaintenanceStatus";
import { formatHours, formatDate } from "../../utils/formatters";
import { StatusBadge } from "../common/StatusBadge";
import { TimelineList } from "../common/TimelineList";

interface RoomGroup {
  roomId: number;
  roomName: string;
  pumps: PumpRotation[];
  primary?: PumpRotation;
  gap: number;
  threshold: number;
  needRotate: boolean;
  supplyRisk: boolean;
  availableCount: number;
  standbyTarget?: PumpRotation;
}

interface Props {
  room: RoomGroup;
  logs: PumpSwitchLog[];
  onRotate: (pump: PumpRotation) => void;
  onConfirmRotate: () => void;
  pendingRotate?: PumpRotation | null;
  onCancelRotate: () => void;
  onToggleMaintenance: (pump: PumpRotation) => void;
  onAddHours: (pump: PumpRotation) => void;
}

export function PumpRotationRoomCard({
  room,
  logs,
  onRotate,
  onConfirmRotate,
  pendingRotate,
  onCancelRotate,
  onToggleMaintenance,
  onAddHours
}: Props) {
  const [showHistory, setShowHistory] = useState(false);
  const roomLogs = logs.filter((l) => l.pump_room_id === room.roomId);

  return (
    <article className={"panel pump-room" + (room.supplyRisk ? " risk" : "")}>
      <div className="pump-room-head">
        <h2>{room.roomName} · 水泵轮换台账</h2>
        <button className="link-btn" onClick={() => setShowHistory((v) => !v)}>
          {showHistory ? "收起切换记录" : `查看切换记录 (${roomLogs.length})`}
        </button>
      </div>

      {room.needRotate && (
        <div className="rotate-tip">
          累计运行时长差已达 <strong>{formatHours(room.gap)}</strong>，超过 {room.threshold} 小时阈值，建议尽快倒泵。
          {room.standbyTarget ? (
            (() => {
              const target: PumpRotation = room.standbyTarget as PumpRotation;
              return pendingRotate?.id === target.id ? (
                <span className="confirm-inline">
                  确认将 <strong>{target.pump_name}</strong> 设为新主泵？
                  <button className="primary-btn" onClick={onConfirmRotate}>确认倒泵</button>
                  <button className="ghost-btn" onClick={onCancelRotate}>取消</button>
                </span>
              ) : (
                <button className="primary-btn" onClick={() => onRotate(target)}>
                  倒向 {target.pump_name}
                </button>
              );
            })()
          ) : (
            <em>当前没有可用备用泵，暂无法倒泵。</em>
          )}
        </div>
      )}

      <div className="table pump-table">
        <div className="pump-row head">
          <span>水泵</span>
          <span>累计运行时长</span>
          <span>当前主备</span>
          <span>检修状态</span>
          <span>上次倒泵</span>
          <span>操作</span>
        </div>
        {room.pumps.map((pump) => {
          const isPrimary = pump.role === "PRIMARY";
          const inMaintenance = pump.maintenance_status === "MAINTENANCE";
          const canSetPrimary = !inMaintenance && !isPrimary;
          const pending = pendingRotate?.id === pump.id;
          return (
            <div key={pump.id} className="pump-row">
              <span className="pump-name">
                {pump.pump_name}
                <small>{pump.device_code}</small>
              </span>
              <span>{formatHours(pump.cumulative_hours)}</span>
              <span>
                <StatusBadge value={isPrimary ? "PRIMARY" : "STANDBY"} />
                <small className="role-text">{PumpRoleText[pump.role]}</small>
              </span>
              <span>
                <StatusBadge value={inMaintenance ? "MAINTENANCE" : "RUNNING"} />
                <small className="role-text">{MaintenanceStatusText[pump.maintenance_status]}</small>
              </span>
              <span><small>{formatDate(pump.last_rotated_at)}</small></span>
              <span className="pump-actions">
                {isPrimary ? (
                  <button className="ghost-btn" onClick={() => onAddHours(pump)}>登记运行 1h</button>
                ) : null}
                {canSetPrimary ? (
                  pending ? (
                    <span className="confirm-inline">
                      <button className="primary-btn" onClick={onConfirmRotate}>确认新主泵</button>
                      <button className="ghost-btn" onClick={onCancelRotate}>取消</button>
                    </span>
                  ) : (
                    <button className="ghost-btn" onClick={() => onRotate(pump)}>设为主泵</button>
                  )
                ) : null}
                {inMaintenance ? (
                  <button className="ghost-btn" onClick={() => onToggleMaintenance(pump)}>检修完成</button>
                ) : (
                  <button className="danger-btn" onClick={() => onToggleMaintenance(pump)}>办理检修</button>
                )}
              </span>
            </div>
          );
        })}
      </div>

      <p className="pump-gap">
        两泵累计差：<strong>{formatHours(room.gap)}</strong>
        （阈值 {room.threshold}h），当前可用 {room.availableCount}/{room.pumps.length} 台。
      </p>

      {showHistory ? (
        <TimelineList
          title="倒泵切换记录"
          emptyText="暂无倒泵记录"
          items={roomLogs.map((log: PumpSwitchLog) => ({
            title: `${log.old_primary_name} → ${log.new_primary_name}（确认新主泵）`,
            desc: `${log.reason}；切换时累计 ${formatHours(log.old_primary_hours)} / ${formatHours(log.new_primary_hours)}`,
            time: log.switched_at,
            badge: "SWITCHED"
          }))}
        />
      ) : null}
    </article>
  );
}
