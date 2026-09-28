NOW = "2026-09-28T08:00:00Z"


def create_pump_rotation_dto(**overrides):
    row = {
        "id": 1,
        "pump_room_id": 1,
        "pump_room": "1号消防泵房",
        "device_id": 101,
        "device_code": "FP-001",
        "pump_name": "1号泵",
        "cumulative_hours": 0.0,
        "role": "STANDBY",
        "maintenance_status": "RUNNING",
        "last_rotated_at": NOW,
        "updated_at": NOW,
    }
    row.update(overrides)
    return row


def create_pump_switch_log_dto(**overrides):
    row = {
        "id": 1,
        "pump_room_id": 1,
        "pump_room": "1号消防泵房",
        "new_primary_id": 2,
        "new_primary_name": "2号泵",
        "old_primary_id": 1,
        "old_primary_name": "1号泵",
        "operator_id": 1,
        "reason": "累计运行时长差超过20小时，例行倒泵",
        "old_primary_hours": 0.0,
        "new_primary_hours": 0.0,
        "switched_at": NOW,
    }
    row.update(overrides)
    return row
