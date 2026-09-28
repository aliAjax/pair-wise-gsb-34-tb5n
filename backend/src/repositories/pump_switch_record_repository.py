from src.seed import seed


class PumpSwitchRecordRepository:
    def find_all(self):
        return sorted(seed["pumpSwitch"], key=lambda row: row["switched_at"], reverse=True)

    def add(self, record):
        seed["pumpSwitch"].insert(0, record)
        return record
