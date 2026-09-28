from src.seed import seed


class FirePumpRepository:
    def find_all(self):
        return seed["firePump"]

    def find_by_id(self, pump_id):
        return next((row for row in seed["firePump"] if row["id"] == pump_id), None)

    def save_all(self, pumps):
        seed["firePump"] = pumps
        return pumps
