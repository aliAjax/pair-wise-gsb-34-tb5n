export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  PUMP_TARGET_UNDER_REPAIR: "检修中的水泵不能设为主泵，请先完成检修并恢复可用状态",
  PUMP_NO_AVAILABLE_STANDBY: "没有可用的备用泵，无法倒泵；请先恢复另一台水泵",
  PUMP_SUPPLY_AT_RISK: "两台水泵均不可用，消防供水中断，存在停供风险"
};
