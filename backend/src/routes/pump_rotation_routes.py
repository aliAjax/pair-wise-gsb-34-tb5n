from fastapi import APIRouter

from src.controllers.pump_rotation_controller import (
    list_pump_rotation,
    list_pump_switch_log,
    rotate_pump,
    set_pump_maintenance,
    register_pump_hours,
)

router = APIRouter(prefix="/api/pump-rotation", tags=["PumpRotation"])
router.get("")(list_pump_rotation)
router.get("/logs")(list_pump_switch_log)
router.post("/rotate")(rotate_pump)
router.post("/maintenance")(set_pump_maintenance)
router.post("/hours")(register_pump_hours)
