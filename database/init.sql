CREATE TABLE IF NOT EXISTS building (
  id INTEGER PRIMARY KEY,
  name TEXT,
  campus TEXT,
  floor_count TEXT,
  fire_grade TEXT,
  manager_id TEXT,
  address_code TEXT
);

CREATE TABLE IF NOT EXISTS fire_device (
  id INTEGER PRIMARY KEY,
  building_id TEXT,
  device_code TEXT,
  device_type TEXT,
  floor TEXT,
  location_desc TEXT,
  install_date TEXT,
  status TEXT,
  next_maintenance_at TEXT
);

CREATE TABLE IF NOT EXISTS inspection_task (
  id INTEGER PRIMARY KEY,
  building_id TEXT,
  inspector_id TEXT,
  plan_date TEXT,
  task_type TEXT,
  status TEXT,
  checklist_version TEXT,
  finished_at TEXT
);

CREATE TABLE IF NOT EXISTS inspection_result (
  id INTEGER PRIMARY KEY,
  task_id TEXT,
  device_id TEXT,
  item_code TEXT,
  result_status TEXT,
  measured_value TEXT,
  photo_url TEXT,
  note TEXT
);

CREATE TABLE IF NOT EXISTS hazard_ticket (
  id INTEGER PRIMARY KEY,
  result_id TEXT,
  severity TEXT,
  owner_id TEXT,
  deadline TEXT,
  rectify_status TEXT,
  rectify_note TEXT,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target_type TEXT,
  target_id TEXT,
  created_at TEXT
);

-- 消防泵房水泵轮换台账
CREATE TABLE IF NOT EXISTS pump_rotation (
  id INTEGER PRIMARY KEY,
  pump_room_id INTEGER,
  pump_room TEXT,
  device_id INTEGER,
  device_code TEXT,
  pump_name TEXT,
  cumulative_hours REAL,
  role TEXT,
  maintenance_status TEXT,
  last_rotated_at TEXT,
  updated_at TEXT
);

-- 消防水泵倒泵（主备切换）记录
CREATE TABLE IF NOT EXISTS pump_switch_log (
  id INTEGER PRIMARY KEY,
  pump_room_id INTEGER,
  pump_room TEXT,
  new_primary_id INTEGER,
  new_primary_name TEXT,
  old_primary_id INTEGER,
  old_primary_name TEXT,
  operator_id INTEGER,
  reason TEXT,
  old_primary_hours REAL,
  new_primary_hours REAL,
  switched_at TEXT
);
