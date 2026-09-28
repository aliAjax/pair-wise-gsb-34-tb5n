import { usePumpRotation } from "../../hooks/usePumpRotation";
import type { FirePump } from "../../types/FirePump";

/**
 * 泵房轮换风险横幅：
 * - 累计差超 20h：提示倒泵（仅警告）
 * - 两台都不可用：标出停供风险（严重）
 */
export function RotationRiskBanner({ pumps }: { pumps: FirePump[] }) {
  const rotation = usePumpRotation(pumps);
  if (rotation.supplyAtRisk) {
    return (
      <div className="alert alert-critical" role="alert">
        <strong>停供风险</strong>
        <span>{rotation.riskHint}</span>
      </div>
    );
  }
  if (rotation.rotateDue) {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>建议倒泵</strong>
        <span>{rotation.rotationHint}</span>
      </div>
    );
  }
  return (
    <div className="alert alert-ok" role="status">
      <strong>轮换正常</strong>
      <span>{rotation.rotationHint}</span>
    </div>
  );
}
