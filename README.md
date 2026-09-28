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

## 消防泵房水泵轮换台账

针对“长期只用主泵、备用泵久不启动、故障时切不过来”的问题，在「消防设备台账」页（`/devices`）增加水泵轮换台账，并在「消防合规总览」页（`/dashboard`）联动风险：

- 每台泵记录**累计运行时长（小时）**、**当前主备角色**（PRIMARY/STANDBY）与**检修状态**（RUNNABLE/UNDER_REPAIR）。
- 主备泵**累计时长差超过 20 小时**（`>` 20，阈值见 `constants/pumpRules` 的 `PUMP_ROTATION_HOURS_LIMIT`）时提示倒泵。
- 倒泵需勾选“已确认新主泵运行”，切换后**新主泵确认、旧主泵转备用**，并在切换记录台账中保留记录（操作人、时间、切换前后累计时长、确认标记）。
- **检修中的泵不能设为主泵**；把当前主泵送修时会自动切到可用备用泵。
- **两台泵都不可用时在总览标出停供风险**（红色横幅），并禁止倒泵。

## 枚举/常量出现位置清单

- DeviceType: constants/DeviceType、types/DeviceType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- InspectionStatus: constants/InspectionStatus、types/InspectionStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- HazardSeverity: constants/HazardSeverity、types/HazardSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PumpRole: 前端 `constants/PumpRole.ts`、`types/PumpRole.ts`、`constants/statusText.ts`、`components/common/PumpRoleBadge.tsx`、`utils/pumpRotation.ts`；后端 `constants/pump_role.py`、`services/fire_pump_service.py`、种子与 `database/init.sql`（fire_pump.role）。
- PumpRepairStatus: 前端 `constants/PumpRepairStatus.ts`、`types/PumpRepairStatus.ts`、`constants/statusText.ts`、`components/common/PumpRepairStatusTag.tsx`、`utils/pumpRotation.ts`；后端 `constants/pump_repair_status.py`、`services/fire_pump_service.py`、种子与 `database/init.sql`（fire_pump.repair_status）。
- 轮换阈值 20 小时: 前端 `constants/pumpRules.ts`、`utils/pumpRotation.ts`、`hooks/usePumpRotation.ts`；后端 `constants/pump_rules.py`、`services/fire_pump_service.py`。
- 轮换错误码/日志: 前后端 `errorCodes/errorMessages`（PUMP_TARGET_UNDER_REPAIR、PUMP_NO_AVAILABLE_STANDBY、PUMP_SUPPLY_AT_RISK）与 `logTemplates`（FirePump、PumpSwitch）。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
