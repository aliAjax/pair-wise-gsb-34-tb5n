export const DeviceType = ["EXTINGUISHER","HYDRANT","SMOKE_DETECTOR","SPRINKLER","EXIT_LIGHT","FIRE_PUMP"] as const;
export type DeviceType = (typeof DeviceType)[number];
export const DeviceTypeText: Record<DeviceType, string> = Object.fromEntries(DeviceType.map((value) => [value, value === "FIRE_PUMP" ? "消防水泵" : value.replace(/_/g, " ")])) as Record<DeviceType, string>;
