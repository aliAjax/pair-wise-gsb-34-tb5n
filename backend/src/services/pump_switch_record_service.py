from src.repositories.pump_switch_record_repository import PumpSwitchRecordRepository


class PumpSwitchRecordService:
    def __init__(self):
        self.repo = PumpSwitchRecordRepository()

    def list(self):
        return self.repo.find_all()
