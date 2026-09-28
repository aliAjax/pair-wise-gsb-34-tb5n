# 消防设施巡检维保平台

面向园区和物业公司的消防设备巡检、隐患整改、维保计划和合规台账系统。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20103>

后端健康检查：<http://localhost:21103/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Redux Toolkit |
| 后端 | FastAPI + Python 3.11 + SQLAlchemy 2.0 |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `fire-inspect`
- `FRONTEND_PORT`: 前端端口，默认 `20103`
- `BACKEND_PORT`: 后端端口，默认 `21103`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: fire-inspect`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-fire-inspect}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 功能说明：消防泵房水泵轮换台账

针对“长期只用主泵、备用泵久不启动、故障时切不过来”的问题，在**消防设备台账页 `/devices`** 增加水泵轮换台账（消防泵房一主一备两台消防水泵）：

- 每台泵记录**累计运行时长**、**当前主备**（主泵/备用泵）与**检修状态**（运行中/检修中）。
- 两泵累计运行时长差**超过 20 小时**自动提示倒泵（阈值常量 `PUMP_ROTATION_HOUR_GAP`，前后端同名模块）。
- 倒泵采用两步确认：选择备用泵后需**确认新主泵**，确认后新泵转主泵、旧主泵转备用，并永久保留一条**切换记录**（含切换瞬间两泵累计时长、原因、操作人），可在台账卡片“查看切换记录”中回看。
- **检修中的泵不能设为主泵**：把主泵直接办理检修时，若存在可用备用泵会被拦截，要求先倒泵；解除检修后才可再设为主泵。
- **两台泵都不能用时**（均检修中），设备台账页与**消防合规总览 `/dashboard`** 顶部共用 `SupplyRiskBanner` 标出红色“停供风险”；把仅剩的主泵置检修需二次确认。
- 提供主泵“登记运行 1h”便于模拟累计时长增长并触发 20 小时倒泵提示。

新增 `PumpRotation`（轮换台账）与 `PumpSwitchLog`（倒泵记录）实体，沿前后端分层拆分为 constants/types/constructors/api/store/hook/组件/页面与后端 constants/types/models/constructors/repositories/services/controllers/routes，写操作同步日志模板与错误码。接口：`GET/POST /api/pump-rotation`、`/logs`、`/rotate`、`/maintenance`、`/hours`。前端在后端不可用时回退本地种子数据，仍可完整体验。

## 枚举/常量出现位置清单

- DeviceType: constants/DeviceType、types/DeviceType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。新增枚举值 `FIRE_PUMP`（消防水泵），同步触达：前端 `constants/DeviceType.ts`、`mocks/seedData.ts`、`types/PumpRotation.ts`；后端 `constants/device_type.py`、`src/seed.py`、`models/pump_rotation.py`。
- PumpRole（PRIMARY/STANDBY）与 MaintenanceStatus（RUNNING/MAINTENANCE）：前端 `constants/PumpRole.ts`、`constants/MaintenanceStatus.ts`、`constants/statusText.ts`、`types/PumpRotation.ts`、`constructors/PumpRotationConstructor.ts`、`components/devices/PumpRotationRoomCard.tsx`；后端 `constants/pump_role.py`、`models/pump_rotation.py`、`types/pump_rotation_payload.py`。
- 倒泵阈值与判定：前端 `constants/pumpRotation.ts`、`hooks/usePumpRotation.ts`；后端 `constants/pump_role.py`、`services/pump_rotation_service.py`。
- InspectionStatus: constants/InspectionStatus、types/InspectionStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- HazardSeverity: constants/HazardSeverity、types/HazardSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
