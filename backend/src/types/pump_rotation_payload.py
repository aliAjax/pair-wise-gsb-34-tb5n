from typing import Literal
from pydantic import BaseModel


class RotatePumpPayload(BaseModel):
    pump_room_id: int
    new_primary_id: int
    operator_id: int = 1
    reason: str = "累计运行时长差超过20小时，执行倒泵"


class SetMaintenancePayload(BaseModel):
    pump_id: int
    maintenance_status: Literal["RUNNING", "MAINTENANCE"]
    operator_id: int = 1
    force: bool = False


class RegisterHoursPayload(BaseModel):
    pump_id: int
    hours: float


PumpRotationPayload = RotatePumpPayload
