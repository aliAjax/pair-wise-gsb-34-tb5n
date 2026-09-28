from fastapi.responses import JSONResponse

from src.services.pump_rotation_service import PumpRotationService, PumpRotationError
from src.types.pump_rotation_payload import (
    RotatePumpPayload,
    SetMaintenancePayload,
    RegisterHoursPayload,
)

service = PumpRotationService()


def list_pump_rotation():
    try:
        return service.list()
    except PumpRotationError as exc:
        return JSONResponse(status_code=400, content={"code": exc.code, "message": str(exc)})


def list_pump_switch_log(pump_room_id: int | None = None):
    return service.list_logs(pump_room_id)


def rotate_pump(payload: RotatePumpPayload):
    try:
        return service.rotate(payload)
    except PumpRotationError as exc:
        return JSONResponse(status_code=400, content={"code": exc.code, "message": str(exc)})


def set_pump_maintenance(payload: SetMaintenancePayload):
    try:
        return service.set_maintenance(payload)
    except PumpRotationError as exc:
        return JSONResponse(status_code=400, content={"code": exc.code, "message": str(exc)})


def register_pump_hours(payload: RegisterHoursPayload):
    try:
        return service.register_hours(payload)
    except PumpRotationError as exc:
        return JSONResponse(status_code=400, content={"code": exc.code, "message": str(exc)})
