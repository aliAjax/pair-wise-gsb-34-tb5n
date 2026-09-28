# 消防泵房轮换规则：累计运行时长差值（小时）超过该阈值即提示倒泵
PUMP_ROTATION_HOURS_LIMIT = 20

PUMP_ROTATION = {
    "hoursLimit": PUMP_ROTATION_HOURS_LIMIT,
    "supplyRiskLevel": "CRITICAL",
    "confirmedNote": "新主泵已确认，旧主泵转备用",
}
