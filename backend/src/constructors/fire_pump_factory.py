from datetime import datetime, timezone


def create_fire_pump_dto(**overrides):
    row = {
        "id": 1,
        "pump_code": "FP-01",
        "name": "1# 消防泵",
        "cumulative_hours": 0.0,
        "role": "PRIMARY",
        "repair_status": "RUNNABLE",
        "repair_note": "",
        "last_switched_at": "2026-09-01T09:00:00Z",
    }
    row.update(overrides)
    return row


def create_fire_pump_response(pump: dict):
    return dict(pump)
