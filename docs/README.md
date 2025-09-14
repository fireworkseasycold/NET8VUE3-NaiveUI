# 文档总览

本目录包含本项目的所有文档、约束与模板说明，旨在为 AI 自动化开发与人工协作提供一致的基线与流程指引。

## 文档结构
- design-constraints.md：技术栈、项目结构与开发规范的权威文字说明（注意：机器校验以仓库根目录 `.ai-constraints.json` 为唯一来源）
- architecture.md：系统架构设计与模块边界
- prompts.json：AI 生成模板清单（含 schemaVersion、prompts[].id）
- 智能体提示词.md：AI 智能体的执行规程、输入映射与文档强制关联规则
- task-tracking.md：任务跟踪表（含模板类型、模板ID、Prompt-Ref、验证状态）

## 使用方式
- 按 prompts.json 的条目执行生成；生成的 Markdown 文档头部必须写入 Prompt-Ref: prompt:id=<id>
- 使用 scripts/validate-ai-output.js 对生成物进行校验（禁用技术、结构、Prompt-Ref 与“依据与来源”）

## 原则
- 以最少但权威的文档集合支撑 AI 自动化；避免冗余与矛盾
- 变更优先更新 .ai-constraints.json 与 prompts.json，并在设计约束与提示词文档中引用与解释

## 示例
- 见 example-templates/ 下的示例模板与生成物

## 文档关联矩阵
- prompts.json → 智能体提示词.md：
  - 智能体提示词.md 定义 Prompt-Ref 标记与使用规则；prompts.json 提供可引用的 prompts[].id。
  - 版本约束：prompts.json.schemaVersion >= 1.1 且每个条目必须具备唯一 id。
- 智能体提示词.md → task-tracking.md：
  - task-tracking.md 的“模板类型/模板ID/Prompt-Ref”列应与生成物中的 Prompt-Ref 对应，便于回链与验收。
- task-tracking.md → validate-ai-output.js：
  - 校验脚本会对非白名单文档检查“依据与来源”与 Prompt-Ref 标记，并校验 Prompt-Ref 位于文档前 30 行。
- .ai-constraints.json → validate-ai-output.js：
  - 禁用技术、版本约束等以 .ai-constraints.json 为唯一机器校验源；脚本在缺失时使用兜底清单。
- design-constraints.md ↔ .ai-constraints.json：
  - design-constraints.md 提供文字性解释与版本引用，不重复罗列清单；修改清单以 .ai-constraints.json 为准。

> 维护建议：
> - 任何新增/调整模板先更新 prompts.json（含 id），再更新 智能体提示词.md 的规则或说明，最后更新 task-tracking.md 的追踪条目。
> - 调整技术禁用/版本边界时，首先更新 .ai-constraints.json，并在 design-constraints.md 中补充说明链接与原因。