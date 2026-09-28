import { PumpRepairStatusText } from "../../constants/PumpRepairStatus";
import type { PumpRepairStatus as PumpRepairValue } from "../../types/PumpRepairStatus";

/** 水泵检修状态标签（设备台账 / 总览共用） */
export function PumpRepairStatusTag({ value }: { value: PumpRepairValue | string }) {
  const text = PumpRepairStatusText[value as PumpRepairValue] ?? value;
  return (
    <span className={"badge pump-repair " + String(value).toLowerCase()}>
      {text}
    </span>
  );
}
