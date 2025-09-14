# 多业务框架设计约束 v1.0

## 1. 技术栈约束

### 前端技术栈
- **框架**: Vue 3 + Vite + TypeScript (组合式API + `<script setup>`)
- **UI 库**: Naive UI v2.34+ (PC + 移动端响应式，支持深色主题)
- **状态管理**: Pinia (替代Vuex，轻量级状态管理)
- **路由**: Vue Router 4.x (支持路由守卫和懒加载)
- **HTTP客户端**: Axios (统一请求拦截和错误处理)
- **测试框架**: Vitest + Vue Testing Library + Playwright (E2E)
- **构建工具**: Vite 5.x (支持热更新和按需编译)
- **代码质量**: ESLint + Prettier + Stylelint
- **容器化**: 必须支持独立容器运行，多环境配置

### 后端技术栈
- **框架**: .NET 8 WebAPI (最小API + 控制器)
- **ORM**: SqlSugar ORM 5.x (支持CodeFirst和读写分离)
- **API规范**: RESTful + Swagger/OpenAPI 3.0 (自动生成文档)
- **配置管理**: 统一 appsettings.json + 环境变量 + IConfiguration
- **依赖注入**: 内置DI容器，支持生命周期管理
- **日志系统**: Serilog + Elasticsearch/Kibana (结构化日志)
- **缓存**: Redis 7.x (分布式缓存和会话存储)
- **消息队列**: RabbitMQ (异步任务处理)
- **测试框架**: xUnit + Moq + FluentAssertions
- **健康检查**: 内置健康检查端点

### 数据库约束
- **数据库类型**: MySQL 8.0+ / PostgreSQL 14+ (生产环境)
- **开发数据库**: SQLite (开发环境，可选)
- **ORM策略**: CodeFirst自动建表，支持数据迁移
- **迁移工具**: DbUp/Flyway (生产环境数据迁移)
- **公共字段**: Id(PK), CreatedAt, UpdatedAt, IsDeleted(软删除)
- **索引规范**: 必须为查询字段添加合适索引
- **连接池**: 配置合理的连接池大小

### 容器与环境
- **容器运行时**: Docker 20.10+
- **编排工具**: Docker Compose v2.x (多服务编排)
- **镜像构建**: 多阶段构建，最小化镜像体积
- **日志管理**: 日志必须写入卷 /logs，支持日志轮转
- **环境分离**: 开发、测试、预发布、生产环境严格分离
- **健康检查**: 容器健康检查配置
- **资源限制**: CPU和内存资源限制配置

## 2. 项目结构约束

```
/NET8VUE3-NaiveUI/
│── 📦 项目配置文件
│   ├── .env                    # 环境变量模板
│   ├── .env.production         # 生产环境配置
│   ├── .env.development        # 开发环境配置
│   ├── docker-compose.yml      # 主Docker编排配置
│   ├── docker-compose.override.yml # 环境覆盖配置
│   └── package.json            # 前端依赖管理
│
│── 📚 文档体系 (docs/)
│   ├── README.md               # 项目说明
│   ├── design-constraints.md   # 设计约束（本文件）
│   ├── architecture.md        # 系统架构设计
│   ├── prompts.json           # AI生成模板配置
│   ├── task-tracking.md       # 任务跟踪
│   └── 智能体提示词.md         # AI助手提示词
│
│── 🛒 电商业务 (ecommerce/)
│   ├── backend/               # .NET8后端
│   │   ├── Controllers/       # API控制器
│   │   ├── Services/          # 业务服务层
│   │   ├── Models/            # 数据模型
│   │   ├── Repositories/      # 数据访问层
│   │   ├── DTOs/              # 数据传输对象
│   │   └── Dockerfile         # 容器配置
│   └── frontend/              # Vue3前端
│       ├── src/
│       │   ├── components/    # 公共组件
│       │   ├── views/         # 页面组件
│       │   ├── stores/        # 状态管理
│       │   ├── router/        # 路由配置
│       │   └── api/           # API接口
│       ├── tests/            # 测试文件
│       ├── Dockerfile         # 容器配置
│       └── nginx.conf         # Nginx配置
│
│── 🏭 工业物联网 (industrial_iot/)
│   ├── backend/               # 结构同电商
│   └── frontend/              # 结构同电商
│
│── 🤖 AI SaaS业务 (ai_saas/)
│   ├── backend/               # 结构同电商
│   └── frontend/              # 结构同电商
│
│── 🛠️ 工具平台 (tools_platform/)
│   ├── backend/               # 结构同电商
│   └── frontend/              # 结构同电商
│
└── 📊 监控与运维 (monitoring/)
    ├── prometheus/            # 监控配置
    ├── grafana/               # 仪表板
    └── loki/                  # 日志聚合
```

## 3. 开发规范约束

### 代码风格规范
- **前端代码**: ESLint + Prettier + Airbnb规范
- **后端代码**: dotnet format + EditorConfig，PascalCase(类/方法)，camelCase(变量/参数)
- **Git提交**: Conventional Commits规范
- **Git Hook**: Husky + lint-staged，pre-commit必须通过lint + test
- **命名规范**: 见名知意，禁止拼音缩写

### API设计规范
- **统一响应格式**:
```json
{
  "code": 0,           // 业务状态码
  "message": "success", // 提示信息
  "data": {},          // 业务数据
  "timestamp": "2024-01-01T00:00:00Z" // 时间戳
}
```
- **HTTP状态码**: 正确使用2xx/4xx/5xx状态码
- **版本管理**: API版本化（URL路径或Header）
- **分页规范**: pageSize/pageNumber统一参数
- **错误处理**: 全局异常处理，友好错误信息

### 测试规范
- **单元测试覆盖率**: >80% (核心业务>90%)
- **测试分类**: 单元测试、集成测试、E2E测试
- **测试数据**: 使用测试夹具(Fixture)，隔离测试环境
- **性能测试**: 关键API必须进行压力测试
- **安全测试**: OWASP Top 10安全漏洞扫描

### 安全规范
- **认证授权**: JWT + Refresh Token
- **密码安全**: BCrypt加密，密码强度验证
- **SQL注入**: 参数化查询，ORM安全使用
- **XSS防护**: 输入输出过滤，CSP策略
- **CSRF防护**: Anti-Forgery Token
- **速率限制**: API调用频率限制

## 4. 部署与运维约束

### 容器化部署
- **一键启动**: Docker Compose一键启动全栈服务
- **环境配置**: 配置必须通过环境变量注入
- **数据持久化**: 数据库数据、日志、上传文件持久化
- **健康检查**: 服务健康状态监控
- **资源管理**: CPU、内存、磁盘资源限制

### 监控告警
- **应用监控**: Prometheus + Grafana
- **日志聚合**: Loki + Grafana
- **链路追踪**: Jaeger/Zipkin (可选)
- **告警规则**: 关键指标异常告警

### CI/CD流程
- **自动化测试**: PR合并前必须通过所有测试
- **镜像构建**: 自动构建Docker镜像
- **安全扫描**: 镜像漏洞扫描
- **部署策略**: 蓝绿部署/金丝雀发布

## 5. 生成约束

### AI生成规范
- **模板驱动**: 所有AI生成必须基于 `/docs/prompts.json` 配置
- **输出路径**: 必须与业务模块路径严格匹配
- **代码质量**: 生成代码必须符合本约束文档规范
- **审查机制**: AI生成代码必须经过人工审查
- 注意：机器校验以仓库根目录的 `.ai-constraints.json` 为唯一来源；本文件仅做文字解释与版本引用，请勿重复罗列清单项，以避免偏差。

### 技术栈稳定性
- **禁止随意更换**: 核心技术栈禁止随意更换
- **升级流程**: 技术栈升级必须更新本文档
- **兼容性**: 确保向后兼容，提供迁移方案

### 扩展性约束
- **插件架构**: 支持功能模块插件化
- **配置化**: 系统行为尽可能配置化
- **API优先**: 前后端分离，API契约优先

---
*最后更新: 2024-01-01*
*版本: v1.0*