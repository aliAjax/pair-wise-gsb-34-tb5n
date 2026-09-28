from fastapi import APIRouter

from src.controllers.fire_pump_controller import (
    list_fire_pump,
    pump_summary,
    rotate_fire_pump,
    set_pump_repair,
    add_pump_hours,
)

router = APIRouter(prefix="/api/fire-pump", tags=["FirePump"])
router.get("")(list_fire_pump)
router.get("/summary")(pump_summary)
router.post("/rotate")(rotate_fire_pump)
router.post("/repair")(set_pump_repair)
router.post("/hours")(add_pump_hours)
