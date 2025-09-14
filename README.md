# NET8VUE3-NaiveUI 多业务框架 v1.0

基于 .NET 8 + Vue 3 + Naive UI 的多业务模块化开发框架

## 🚀 特性

- **多业务支持**: 电商、工业IoT、AI SaaS、工具平台
- **技术栈统一**: 严格的技术约束和开发规范
- **AI驱动开发**: 智能代码生成和质量验证
- **容器化部署**: Docker Compose 一键启动
- **模块化架构**: 各业务模块独立开发部署

## 📁 项目结构

```
/NET8VUE3-NaiveUI/
├── 📚 docs/                    # 文档体系
├── 🛒 ecommerce/               # 电商业务模块
├── 🏭 industrial_iot/          # 工业物联网模块
├── 🤖 ai_saas/                # AI SaaS业务模块
├── 🛠️ tools_platform/         # 工具平台模块
├── 📊 monitoring/             # 监控运维
└── 🔧 scripts/                # 开发脚本
```

## 🛠️ 技术栈

- **前端**: Vue 3.3+ + TypeScript + Naive UI + Pinia
- **后端**: .NET 8 + SqlSugar ORM + JWT认证
- **数据库**: MySQL 8.0+ / PostgreSQL 14+
- **容器**: Docker + Docker Compose
- **监控**: Prometheus + Grafana + Loki

## 📖 使用指南

1. 阅读 `docs/design-constraints.md` 了解技术约束
2. 查看 `docs/architecture.md` 了解系统架构
3. 使用 `docs/prompts.json` 配置AI生成模板
4. 遵循 `docs/智能体提示词.md` 执行代码生成

## 🚀 快速开始

```bash
# 克隆项目
git clone <repository-url>

# 启动开发环境
docker-compose up -d

# 访问服务
# 前端: http://localhost:3000
# 后端: http://localhost:5000
# 监控: http://localhost:9090
```

## 📄 许可证

MIT License

---
*版本: v1.0*
*最后更新: 2024-01-01*
