from src.constants.error_codes import ERROR_CODES
from src.constants.error_messages import ERROR_MESSAGES
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.pump_rules import PUMP_ROTATION_HOURS_LIMIT, PUMP_ROTATION
from src.repositories.fire_pump_repository import FirePumpRepository
from src.repositories.pump_switch_record_repository import PumpSwitchRecordRepository
from src.constructors.pump_switch_record_factory import build_pump_switch_record


class PumpRuleError(Exception):
    """轮换业务规则异常，携带错误码由 controller 包装返回。"""

    def __init__(self, code):
        super().__init__(ERROR_MESSAGES[code])
        self.code = ERROR_CODES[code]


class FirePumpService:
    def __init__(self):
        self.repo = FirePumpRepository()
        self.switch_repo = PumpSwitchRecordRepository()

    # ---- 查询与规则 ----
    def list(self):
        return self.repo.find_all()

    @staticmethod
    def _is_runnable(pump):
        return pump["repair_status"] == "RUNNABLE"

    def _primary(self, pumps):
        return next((p for p in pumps if p["role"] == "PRIMARY"), None)

    def _standby(self, pumps):
        return next((p for p in pumps if p["role"] == "STANDBY"), None)

    def gap_hours(self, pumps):
        if len(pumps) < 2:
            return 0.0
        return abs(pumps[0]["cumulative_hours"] - pumps[1]["cumulative_hours"])

    def should_rotate(self, pumps):
        return self.gap_hours(pumps) > PUMP_ROTATION_HOURS_LIMIT

    def is_supply_at_risk(self, pumps):
        return len(pumps) > 0 and all(not self._is_runnable(p) for p in pumps)

    def summary(self):
        pumps = self.list()
        primary = self._primary(pumps)
        return {
            "pumps": pumps,
            "primary_id": primary["id"] if primary else None,
            "gap_hours": self.gap_hours(pumps),
            "hours_limit": PUMP_ROTATION_HOURS_LIMIT,
            "rotate_due": self.should_rotate(pumps),
            "supply_at_risk": self.is_supply_at_risk(pumps),
            "available_count": sum(1 for p in pumps if self._is_runnable(p)),
        }

    def _assert_can_rotate(self, pumps):
        if self.is_supply_at_risk(pumps):
            raise PumpRuleError("PUMP_SUPPLY_AT_RISK")
        standby = self._standby(pumps)
        if not standby or not self._is_runnable(standby):
            raise PumpRuleError("PUMP_NO_AVAILABLE_STANDBY")
        primary = self._primary(pumps)
        if primary and not self._is_runnable(primary):
            raise PumpRuleError("PUMP_TARGET_UNDER_REPAIR")
        return standby

    # ---- 写操作 ----
    def rotate(self, operator="值班工程师", note=None):
        """倒泵：确认新主泵，旧主泵转备用，保留切换记录。"""
        pumps = [dict(p) for p in self.list()]
        old_primary = self._primary(pumps)
        standby = self._assert_can_rotate(pumps)
        if old_primary and standby["id"] == old_primary["id"]:
            raise PumpRuleError("VALIDATION_FAILED")

        from datetime import datetime, timezone

        switched_at = datetime.now(timezone.utc).isoformat()
        for pump in pumps:
            pump["role"] = "PRIMARY" if pump["id"] == standby["id"] else "STANDBY"
            pump["last_switched_at"] = switched_at

        record = build_pump_switch_record(
            old_primary or standby, standby, operator, note or PUMP_ROTATION["confirmedNote"]
        )
        record["switched_at"] = switched_at
        self.repo.save_all(pumps)
        self.switch_repo.add(record)
        print("audit", LOG_TEMPLATES["PumpSwitch"][0], standby["id"])
        return {"pumps": pumps, "record": record}

    def assign_primary(self, pump_id):
        """检修中的泵不能设为主泵。"""
        pumps = [dict(p) for p in self.list()]
        target = next((p for p in pumps if p["id"] == pump_id), None)
        if not target or not self._is_runnable(target):
            raise PumpRuleError("PUMP_TARGET_UNDER_REPAIR")
        for pump in pumps:
            pump["role"] = "PRIMARY" if pump["id"] == pump_id else "STANDBY"
        return self.repo.save_all(pumps)

    def set_repair(self, pump_id, repair_status, repair_note=None):
        pumps = [dict(p) for p in self.list()]
        target = next((p for p in pumps if p["id"] == pump_id), None)
        if not target:
            raise PumpRuleError("VALIDATION_FAILED")
        target["repair_status"] = repair_status
        target["repair_note"] = repair_note or ""

        primary = self._primary(pumps)
        if repair_status == "UNDER_REPAIR" and primary and primary["id"] == pump_id:
            # 当前主泵送修：优先切到可用备用泵，否则进入停供风险
            fallback = next(
                (p for p in pumps if p["id"] != pump_id and self._is_runnable(p)), None
            )
            if fallback:
                for pump in pumps:
                    pump["role"] = "PRIMARY" if pump["id"] == fallback["id"] else "STANDBY"
            else:
                target["role"] = "STANDBY"  # 两台均不可用，进入停供风险
        elif repair_status == "RUNNABLE" and self._is_runnable(target):
            # 检修完成：当前没有可用主泵时，恢复的泵自动补为主泵
            has_runnable_primary = primary is not None and self._is_runnable(primary)
            if not has_runnable_primary:
                for pump in pumps:
                    pump["role"] = "PRIMARY" if pump["id"] == pump_id else "STANDBY"
        print("audit", LOG_TEMPLATES["FirePump"][2], pump_id, repair_status)
        return self.repo.save_all(pumps)

    def add_hours(self, pump_id, hours):
        if hours <= 0:
            raise PumpRuleError("VALIDATION_FAILED")
        pumps = [dict(p) for p in self.list()]
        target = next((p for p in pumps if p["id"] == pump_id), None)
        if not target:
            raise PumpRuleError("VALIDATION_FAILED")
        target["cumulative_hours"] = round(target["cumulative_hours"] + hours, 2)
        print("audit", LOG_TEMPLATES["FirePump"][1], pump_id, hours)
        return self.repo.save_all(pumps)
