interface Props {
  risk: boolean;
  rooms?: string[];
  detail?: string;
}

// 两台泵都不能用时，在总览/设备页标出停供风险（Dashboard 与 DevicesPage 共用）
export function SupplyRiskBanner({ risk, rooms = [], detail }: Props) {
  if (!risk) {
    return (
      <div className="risk-banner ok">
        <strong>供水状态正常</strong>
        <span>各消防泵房至少有一台水泵可用，主备轮换按台账执行。</span>
      </div>
    );
  }
  return (
    <div className="risk-banner danger" role="alert">
      <strong>⚠ 停供风险</strong>
      <span>
        {rooms.length > 0 ? `${rooms.join("、")} 两台水泵均不可用，` : "泵房两台水泵均不可用，"}
        {detail ?? "消防供水中断，请立即恢复至少一台水泵。"}
      </span>
    </div>
  );
}
