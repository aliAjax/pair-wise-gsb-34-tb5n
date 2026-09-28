from datetime import datetime, timezone

from src.repositories.pump_rotation_repository import PumpRotationRepository
from src.constructors.pump_rotation_factory import create_pump_switch_log_dto
from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.pump_role import PUMP_ROTATION_HOUR_GAP


def _now():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class PumpRotationError(Exception):
    def __init__(self, code):
        self.code = code
        super().__init__(code)


class PumpRotationService:
    def __init__(self):
        self.repo = PumpRotationRepository()

    def list(self):
        return self.repo.find_all()

    def list_logs(self, pump_room_id=None):
        return self.repo.find_logs(pump_room_id)

    def runtime_gap(self, pumps):
        if len(pumps) < 2:
            return 0.0
        hours = [float(p["cumulative_hours"]) for p in pumps]
        return max(hours) - min(hours)

    def need_rotate(self, pumps):
        # 累计差超过 20 小时提示倒泵
        return self.runtime_gap(pumps) > PUMP_ROTATION_HOUR_GAP

    def supply_risk(self, pumps):
        # 两台都不能用（均检修中）
        return bool(pumps) and all(p["maintenance_status"] == "MAINTENANCE" for p in pumps)

    def rotate(self, payload):
        pumps = self.repo.find_by_room(payload.pump_room_id)
        target = next((p for p in pumps if p["id"] == payload.new_primary_id), None)
        old_primary = next((p for p in pumps if p["role"] == "PRIMARY"), None)

        if target is None:
            raise PumpRotationError(ERROR_CODES["VALIDATION_FAILED"])
        # 检修中的泵不能设为主泵
        if target["maintenance_status"] == "MAINTENANCE":
            raise PumpRotationError(ERROR_CODES["PUMP_IN_MAINTENANCE"])
        # 两台都不能用时无法倒泵
        if not any(p["maintenance_status"] == "RUNNING" for p in pumps):
            raise PumpRotationError(ERROR_CODES["PUMP_NO_AVAILABLE"])
        if old_primary is None or old_primary["id"] == target["id"]:
            return pumps

        # 确认新主泵投用，旧主泵转备用
        stamp = _now()
        for pump in pumps:
            pump["role"] = "PRIMARY" if pump["id"] == target["id"] else "STANDBY"
            pump["last_rotated_at"] = stamp
            pump["updated_at"] = stamp

        self.repo.add_switch_log(create_pump_switch_log_dto(
            pump_room_id=old_primary["pump_room_id"],
            pump_room=old_primary["pump_room"],
            new_primary_id=target["id"],
            new_primary_name=target["pump_name"],
            old_primary_id=old_primary["id"],
            old_primary_name=old_primary["pump_name"],
            operator_id=payload.operator_id,
            reason=payload.reason,
            old_primary_hours=old_primary["cumulative_hours"],
            new_primary_hours=target["cumulative_hours"],
        ))
        return pumps

    def set_maintenance(self, payload):
        pump = self.repo.find_one(payload.pump_id)
        if pump is None:
            raise PumpRotationError(ERROR_CODES["VALIDATION_FAILED"])

        if payload.maintenance_status == "MAINTENANCE":
            others = [p for p in self.repo.find_all() if p["id"] != payload.pump_id]
            has_running_standby = any(p["maintenance_status"] == "RUNNING" for p in others)
            # 主泵检修前必须先倒泵到可用备用泵
            if pump["role"] == "PRIMARY" and has_running_standby:
                raise PumpRotationError(ERROR_CODES["PUMP_ROTATE_FIRST"])
            # 两台都将不可用 → 停供风险，需强制确认
            if pump["role"] == "PRIMARY" and not has_running_standby and not payload.force:
                raise PumpRotationError(ERROR_CODES["PUMP_SUPPLY_RISK_CONFIRM"])

        pump["maintenance_status"] = payload.maintenance_status
        pump["updated_at"] = _now()
        return self.repo.find_all()

    def register_hours(self, payload):
        pump = self.repo.find_one(payload.pump_id)
        if pump is None:
            raise PumpRotationError(ERROR_CODES["VALIDATION_FAILED"])
        pump["cumulative_hours"] = round(float(pump["cumulative_hours"]) + payload.hours, 1)
        pump["updated_at"] = _now()
        return self.repo.find_all()

    def log_template(self, name):
        return LOG_TEMPLATES["PumpRotation"]
