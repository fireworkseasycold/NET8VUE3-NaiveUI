| 业务              | 模块     | 类型   | 输出路径                          | 模板类型 | 模板ID | Prompt-Ref | 生成状态 | 前端/后端可运行 | Docker 热更新 | Lint/测试通过 | 代码规范确认 | 验证状态 | 备注                |
| --------------- | ------ | ---- | ----------------------------- | ------ | ------ | ---------- | ---- | -------- | ---------- | --------- | ------ | ------ | ----------------- |
| ecommerce       | 商品管理   | 后端骨架 | /ecommerce/backend/骨架/        |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | CRUD + API + ORM表 |
| ecommerce       | 订单管理   | 后端骨架 | /ecommerce/backend/骨架/        |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | CRUD + API        |
| ecommerce       | 用户管理   | 后端骨架 | /ecommerce/backend/骨架/        |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 权限控制              |
| ecommerce       | 支付结算   | 后端骨架 | /ecommerce/backend/骨架/        |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | API + 流程逻辑        |
| ecommerce       | 商品列表组件 | 前端组件 | /ecommerce/frontend/实现/       |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | HMR + 移动端         |
| ecommerce       | 订单列表组件 | 前端组件 | /ecommerce/frontend/实现/       |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 分页、筛选             |
| ecommerce       | 用户管理组件 | 前端组件 | /ecommerce/frontend/实现/       |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 权限可视化             |
| industrial_iot | 设备管理   | 后端骨架 | /industrial_iot/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | CRUD + 状态同步       |
| industrial_iot | 传感器数据  | 后端骨架 | /industrial_iot/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 数据采集与存储           |
| industrial_iot | 实时监控   | 后端骨架 | /industrial_iot/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | WebSocket 服务      |
| industrial_iot | 报警规则   | 后端骨架 | /industrial_iot/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 告警逻辑与通知           |
| industrial_iot | 设备列表组件 | 前端组件 | /industrial_iot/frontend/实现/ |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | HMR + 响应式         |
| industrial_iot | 实时监控组件 | 前端组件 | /industrial_iot/frontend/实现/ |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | WebSocket 数据展示    |
| ai_saas        | 模型管理   | 后端骨架 | /ai_saas/backend/骨架/         |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 上传/调用/权限          |
| ai_saas        | 任务调度   | 后端骨架 | /ai_saas/backend/骨架/         |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 推理/训练调度           |
| ai_saas        | 用户计费   | 后端骨架 | /ai_saas/backend/骨架/         |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 调用次数/订阅           |
| ai_saas        | 模型展示组件 | 前端组件 | /ai_saas/frontend/实现/        |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 列表 + 调用按钮         |
| ai_saas        | 用户订阅组件 | 前端组件 | /ai_saas/frontend/实现/        |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 管理订阅状态            |
| tools_platform | 工具接口   | 后端骨架 | /tools_platform/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | CRUD + API        |
| tools_platform | 分类管理   | 后端骨架 | /tools_platform/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 工具分类逻辑            |
| tools_platform | 收藏记录   | 后端骨架 | /tools_platform/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 用户收藏状态            |
| tools_platform | 搜索接口   | 后端骨架 | /tools_platform/backend/骨架/  |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 工具搜索逻辑            |
| tools_platform | 工具列表组件 | 前端组件 | /tools_platform/frontend/实现/ |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | HMR + 响应式         |
| tools_platform | 工具搜索组件 | 前端组件 | /tools_platform/frontend/实现/ |        |        |            | ⬜    | ✅        | ✅          | ✅         | ⬜      |        | 支持分类 + 搜索         |

> 关联规范：
> - Prompt-Ref：每个生成的 Markdown 文档头部必须包含 `Prompt-Ref: prompt:id=<id>`，id 来源于 docs/prompts.json 的 prompts[].id。
> - 回链：表中“模板ID/模板类型/Prompt-Ref”用于从交付物快速回链到 prompts.json 条目。
> - 校验：运行 `node scripts/validate-ai-output.js <文件或目录>` 可校验 Prompt-Ref 与“依据与来源”是否合规，并执行禁用技术/结构检查。
