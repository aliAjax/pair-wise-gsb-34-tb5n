import { PumpRoleText } from "../../constants/PumpRole";
import type { PumpRole as PumpRoleValue } from "../../types/PumpRole";

/** 主备泵角色徽标（设备台账 / 总览共用） */
export function PumpRoleBadge({ value }: { value: PumpRoleValue | string }) {
  const text = PumpRoleText[value as PumpRoleValue] ?? value;
  return (
    <span className={"badge pump-role " + String(value).toLowerCase()}>
      {text}
    </span>
  );
}
