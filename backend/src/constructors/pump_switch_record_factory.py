from datetime import datetime, timezone


def create_pump_switch_record_dto(**overrides):
    row = {
        "id": 1,
        "switched_at": "2026-09-01T09:00:00Z",
        "from_pump_id": 2,
        "to_pump_id": 1,
        "operator": "值班工程师",
        "from_pump_hours": 0.0,
        "to_pump_hours": 0.0,
        "note": "新主泵已确认，旧主泵转备用",
        "confirmed": True,
    }
    row.update(overrides)
    return row


def build_pump_switch_record(from_pump, to_pump, operator: str, note: str):
    return create_pump_switch_record_dto(
        id=int(datetime.now(timezone.utc).timestamp()),
        switched_at=datetime.now(timezone.utc).isoformat(),
        from_pump_id=from_pump["id"] if from_pump else to_pump["id"],
        to_pump_id=to_pump["id"],
        operator=operator,
        from_pump_hours=(from_pump or {}).get("cumulative_hours", 0.0),
        to_pump_hours=to_pump["cumulative_hours"],
        note=note,
        confirmed=to_pump["repair_status"] == "RUNNABLE",
    )


def create_pump_switch_response(record: dict):
    return dict(record)
