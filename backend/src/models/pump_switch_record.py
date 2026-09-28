from pydantic import BaseModel


class PumpSwitchRecord(BaseModel):
    id: int | float
    switched_at: str
    from_pump_id: int | float
    to_pump_id: int | float
    operator: str
    from_pump_hours: float
    to_pump_hours: float
    note: str
    confirmed: bool
