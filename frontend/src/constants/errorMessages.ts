export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  PUMP_IN_MAINTENANCE: "检修中的水泵不能设为主泵，请先解除检修状态",
  PUMP_NO_AVAILABLE: "泵房内没有可用水泵，无法执行倒泵",
  PUMP_ROTATE_FIRST: "该泵当前是主泵，且存在可用备用泵，请先执行倒泵再办理检修",
  PUMP_SUPPLY_RISK_CONFIRM: "主泵检修后两台泵都将不可用，将造成停供，请二次确认"
};
