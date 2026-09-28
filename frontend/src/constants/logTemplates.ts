export const LOG_TEMPLATES = {
  Building: ["建筑楼栋创建", "建筑楼栋更新", "建筑楼栋状态变更", "建筑楼栋导出"],
  FireDevice: ["消防设备创建", "消防设备更新", "消防设备状态变更", "消防设备导出"],
  InspectionTask: ["巡检任务创建", "巡检任务更新", "巡检任务状态变更", "巡检任务导出"],
  InspectionResult: ["巡检结果创建", "巡检结果更新", "巡检结果状态变更", "巡检结果导出"],
  HazardTicket: ["隐患整改单创建", "隐患整改单更新", "隐患整改单状态变更", "隐患整改单导出"],
  PumpRotation: [
    "消防水泵倒泵：新主泵 {newPrimary} 确认投用，旧主泵 {oldPrimary} 转备用",
    "消防水泵检修状态变更：{pump} 置为 {status}",
    "消防水泵累计运行时长登记：{pump} 增加 {hours} 小时",
    "消防水泵轮换台账导出"
  ]
};
