from src.services.pump_switch_record_service import PumpSwitchRecordService

service = PumpSwitchRecordService()


def list_pump_switch_record():
    return service.list()
