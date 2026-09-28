PumpRole = ["PRIMARY", "STANDBY"]
PumpRoleText = {"PRIMARY": "主泵", "STANDBY": "备用泵"}

MaintenanceStatus = ["RUNNING", "MAINTENANCE"]
MaintenanceStatusText = {"RUNNING": "运行中", "MAINTENANCE": "检修中"}

# 累计运行时长差超过该阈值（小时）即提示倒泵
PUMP_ROTATION_HOUR_GAP = 20
