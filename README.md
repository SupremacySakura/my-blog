# Monorepo（pnpm）初始化说明

本仓库为使用 pnpm 管理的 monorepo 框架，包含 apps 与 packages 两类子包。

## 结构
- apps/*：应用层示例（如 web）
- packages/*：共享库与配置（如 utils、tsconfig）

## 基本使用
- 全局安装依赖：`pnpm install`
- 运行所有包的脚本（示例）：`pnpm -r run build`、`pnpm -r run test`
- 运行所有应用的开发脚本：`pnpm -r --filter ./apps/* run dev`

## 开发建议
- 在 apps 中依赖内部包请使用 `workspace:*` 版本范围，以启用工作区链接。
- 尽量在 packages/tsconfig 中统一 TypeScript 配置，apps 与其他包继承它。

## 目录示例（初始化后）
```
apps/
  web/
packages/
  tsconfig/
  utils/
```

