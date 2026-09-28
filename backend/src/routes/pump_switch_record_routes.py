from fastapi import APIRouter

from src.controllers.pump_switch_record_controller import list_pump_switch_record

router = APIRouter(prefix="/api/pump-switch", tags=["PumpSwitchRecord"])
router.get("")(list_pump_switch_record)
