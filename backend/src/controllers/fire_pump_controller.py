from fastapi import HTTPException

from src.services.fire_pump_service import FirePumpService, PumpRuleError
from src.types.fire_pump_payload import PumpRotatePayload
from src.types.pump_switch_payload import PumpRepairPayload, PumpHoursPayload

service = FirePumpService()


def list_fire_pump():
    try:
        return service.list()
    except PumpRuleError as exc:
        raise HTTPException(status_code=400, detail={"code": exc.code, "message": str(exc)})


def pump_summary():
    try:
        return service.summary()
    except PumpRuleError as exc:
        raise HTTPException(status_code=400, detail={"code": exc.code, "message": str(exc)})


def rotate_fire_pump(payload: PumpRotatePayload):
    try:
        return service.rotate(operator=payload.operator, note=payload.note)
    except PumpRuleError as exc:
        raise HTTPException(status_code=409, detail={"code": exc.code, "message": str(exc)})


def set_pump_repair(payload: PumpRepairPayload):
    try:
        return service.set_repair(payload.pump_id, payload.repair_status, payload.repair_note)
    except PumpRuleError as exc:
        raise HTTPException(status_code=409, detail={"code": exc.code, "message": str(exc)})


def add_pump_hours(payload: PumpHoursPayload):
    try:
        return service.add_hours(payload.pump_id, payload.hours)
    except PumpRuleError as exc:
        raise HTTPException(status_code=400, detail={"code": exc.code, "message": str(exc)})
