export const mockData = {
  "building": [
    {
      "id": 1,
      "name": "name 1",
      "campus": "campus 1",
      "floor_count": "floor count 1",
      "fire_grade": "fire grade 1",
      "manager_id": 1,
      "address_code": "address code 1"
    },
    {
      "id": 2,
      "name": "name 2",
      "campus": "campus 2",
      "floor_count": "floor count 2",
      "fire_grade": "fire grade 2",
      "manager_id": 2,
      "address_code": "address code 2"
    },
    {
      "id": 3,
      "name": "name 3",
      "campus": "campus 3",
      "floor_count": "floor count 3",
      "fire_grade": "fire grade 3",
      "manager_id": 3,
      "address_code": "address code 3"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "device code 1",
      "device_type": "HYDRANT",
      "floor": "floor 1",
      "location_desc": "location desc 1",
      "install_date": "2026-06-11T09:00:00Z",
      "status": "IN_PROGRESS",
      "next_maintenance_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 2,
      "device_code": "device code 2",
      "device_type": "SMOKE_DETECTOR",
      "floor": "floor 2",
      "location_desc": "location desc 2",
      "install_date": "2026-06-12T09:00:00Z",
      "status": "SUBMITTED",
      "next_maintenance_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "device_code": "device code 3",
      "device_type": "SPRINKLER",
      "floor": "floor 3",
      "location_desc": "location desc 3",
      "install_date": "2026-06-13T09:00:00Z",
      "status": "PLANNED",
      "next_maintenance_at": "2026-06-13T09:00:00Z"
    },
    {
      "id": 101,
      "building_id": 1,
      "device_code": "FP-001",
      "device_type": "FIRE_PUMP",
      "floor": "B1",
      "location_desc": "1号消防泵房 1号泵",
      "install_date": "2024-03-01T09:00:00Z",
      "status": "IN_PROGRESS",
      "next_maintenance_at": "2026-10-15T09:00:00Z"
    },
    {
      "id": 102,
      "building_id": 1,
      "device_code": "FP-002",
      "device_type": "FIRE_PUMP",
      "floor": "B1",
      "location_desc": "1号消防泵房 2号泵",
      "install_date": "2024-03-01T09:00:00Z",
      "status": "IN_PROGRESS",
      "next_maintenance_at": "2026-10-15T09:00:00Z"
    }
  ],
  "pumpRotation": [
    {
      "id": 1,
      "pump_room_id": 1,
      "pump_room": "1号消防泵房",
      "device_id": 101,
      "device_code": "FP-001",
      "pump_name": "1号泵",
      "cumulative_hours": 128.5,
      "role": "PRIMARY",
      "maintenance_status": "RUNNING",
      "last_rotated_at": "2026-08-01T09:00:00Z",
      "updated_at": "2026-09-27T20:00:00Z"
    },
    {
      "id": 2,
      "pump_room_id": 1,
      "pump_room": "1号消防泵房",
      "device_id": 102,
      "device_code": "FP-002",
      "pump_name": "2号泵",
      "cumulative_hours": 96.0,
      "role": "STANDBY",
      "maintenance_status": "RUNNING",
      "last_rotated_at": "2026-08-01T09:00:00Z",
      "updated_at": "2026-09-27T20:00:00Z"
    }
  ],
  "pumpSwitchLog": [
    {
      "id": 1,
      "pump_room_id": 1,
      "pump_room": "1号消防泵房",
      "new_primary_id": 101,
      "new_primary_name": "1号泵",
      "old_primary_id": 102,
      "old_primary_name": "2号泵",
      "operator_id": 1,
      "reason": "月度例行倒泵",
      "old_primary_hours": 64.0,
      "new_primary_hours": 60.5,
      "switched_at": "2026-08-01T09:00:00Z"
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 1,
      "plan_date": "2026-06-11T09:00:00Z",
      "task_type": "HYDRANT",
      "status": "IN_PROGRESS",
      "checklist_version": "checklist version 1",
      "finished_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 2,
      "inspector_id": 2,
      "plan_date": "2026-06-12T09:00:00Z",
      "task_type": "SMOKE_DETECTOR",
      "status": "SUBMITTED",
      "checklist_version": "checklist version 2",
      "finished_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 3,
      "inspector_id": 3,
      "plan_date": "2026-06-13T09:00:00Z",
      "task_type": "SPRINKLER",
      "status": "PLANNED",
      "checklist_version": "checklist version 3",
      "finished_at": "2026-06-13T09:00:00Z"
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 1,
      "device_id": 1,
      "item_code": "item code 1",
      "result_status": "IN_PROGRESS",
      "measured_value": "measured value 1",
      "photo_url": "/mock/photo_url-1.png",
      "note": "note 1"
    },
    {
      "id": 2,
      "task_id": 2,
      "device_id": 2,
      "item_code": "item code 2",
      "result_status": "SUBMITTED",
      "measured_value": "measured value 2",
      "photo_url": "/mock/photo_url-2.png",
      "note": "note 2"
    },
    {
      "id": 3,
      "task_id": 3,
      "device_id": 3,
      "item_code": "item code 3",
      "result_status": "PLANNED",
      "measured_value": "measured value 3",
      "photo_url": "/mock/photo_url-3.png",
      "note": "note 3"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 1,
      "severity": "severity 1",
      "owner_id": 1,
      "deadline": "deadline 1",
      "rectify_status": "IN_PROGRESS",
      "rectify_note": "rectify note 1",
      "closed_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "result_id": 2,
      "severity": "severity 2",
      "owner_id": 2,
      "deadline": "deadline 2",
      "rectify_status": "SUBMITTED",
      "rectify_note": "rectify note 2",
      "closed_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "result_id": 3,
      "severity": "severity 3",
      "owner_id": 3,
      "deadline": "deadline 3",
      "rectify_status": "PLANNED",
      "rectify_note": "rectify note 3",
      "closed_at": "2026-06-13T09:00:00Z"
    }
  ]
} as const;
