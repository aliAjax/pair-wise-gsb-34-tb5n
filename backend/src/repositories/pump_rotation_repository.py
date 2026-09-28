from datetime import datetime, timezone

from src.seed import seed


def _now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class PumpRotationRepository:
    def find_all(self):
        return seed["pumpRotation"]

    def find_logs(self, pump_room_id=None):
        logs = seed["pumpSwitchLog"]
        if pump_room_id is not None:
            logs = [row for row in logs if row["pump_room_id"] == pump_room_id]
        return logs

    def find_by_room(self, pump_room_id):
        return [row for row in seed["pumpRotation"] if row["pump_room_id"] == pump_room_id]

    def find_one(self, pump_id):
        return next((row for row in seed["pumpRotation"] if row["id"] == pump_id), None)

    def add_switch_log(self, log):
        log["id"] = (seed["pumpSwitchLog"][0]["id"] + 1) if seed["pumpSwitchLog"] else 1
        log["switched_at"] = _now()
        seed["pumpSwitchLog"].insert(0, log)
        return log
