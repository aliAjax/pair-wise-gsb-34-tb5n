from pydantic import BaseModel


class FirePump(BaseModel):
    id: int | float
    pump_code: str
    name: str
    # 累计运行时长（小时）
    cumulative_hours: float
    # 当前主备角色 PRIMARY / STANDBY
    role: str
    # 检修状态 RUNNABLE / UNDER_REPAIR
    repair_status: str
    repair_note: str
    last_switched_at: str
