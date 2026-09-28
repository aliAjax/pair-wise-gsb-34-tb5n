from pydantic import BaseModel


class PumpRotatePayload(BaseModel):
    operator: str = "值班工程师"
    note: str | None = None
