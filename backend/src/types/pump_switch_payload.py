from pydantic import BaseModel


class PumpRepairPayload(BaseModel):
    pump_id: int
    repair_status: str
    repair_note: str | None = None


class PumpHoursPayload(BaseModel):
    pump_id: int
    hours: float
