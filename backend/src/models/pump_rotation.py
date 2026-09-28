from typing import Literal
from pydantic import BaseModel

PumpRoleLiteral = Literal["PRIMARY", "STANDBY"]
MaintenanceLiteral = Literal["RUNNING", "MAINTENANCE"]


class PumpRotation(BaseModel):
    id: int
    pump_room_id: int
    pump_room: str
    device_id: int
    device_code: str
    pump_name: str
    cumulative_hours: float
    role: PumpRoleLiteral
    maintenance_status: MaintenanceLiteral
    last_rotated_at: str
    updated_at: str


class PumpSwitchLog(BaseModel):
    id: int
    pump_room_id: int
    pump_room: str
    new_primary_id: int
    new_primary_name: str
    old_primary_id: int
    old_primary_name: str
    operator_id: int
    reason: str
    old_primary_hours: float
    new_primary_hours: float
    switched_at: str
