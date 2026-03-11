# My Blog Project

本仓库为使用 pnpm 管理的 monorepo 框架，包含 apps 与 packages 两类子包。

## 结构

- `apps/blog-frontend`: Next.js 前端应用
- `apps/blog-server`: Fastify 后端应用
- `nginx/`: Nginx 配置文件及 Docker 构建脚本
- `packages/*`: 共享库与配置

## Docker 一键部署

本项目支持使用 Docker Compose 进行一键部署，包含 Frontend, Backend, MongoDB 和 Nginx 服务。

### 前置要求

- Docker & Docker Compose 已安装
- 80/443 端口未被占用（或者在配置中修改端口）

### 快速开始

1. **配置环境变量**

   复制示例配置文件：
   ```bash
   cp .env.example .env
   ```

   根据需要修改 `.env` 文件中的配置：
   ```ini
   # 域名配置
   DOMAIN=example.com
   ENABLE_HTTPS=false  # 设置为 true 启用 HTTPS

   # 端口配置 (Nginx 暴露给宿主机的端口)
   FRONTEND_HTTP_PORT=80
   FRONTEND_HTTPS_PORT=443

   # 数据库配置
   MONGO_DB=blog
   MONGO_PORT=27017

   # 后端密钥 (请修改为强随机字符串)
   ACCESS_SECRET=your_access_secret_key
   REFRESH_SECRET=your_refresh_secret_key
   OWNER_SECRET=your_owner_secret_key

   # 邮件服务配置 (用于注册验证码等)
   MAIL_HOST=smtp.example.com
   MAIL_PORT=465
   MAIL_USER=user@example.com
   MAIL_PASS=password
   ```

2. **SSL 证书配置 (可选)**

   如果启用了 HTTPS (`ENABLE_HTTPS=true`)，请将证书文件放入 `ssl/` 目录：
   - `ssl/fullchain.pem`: 完整证书链
   - `ssl/privkey.pem`: 私钥文件

   > 注意：`ssl/` 目录位于项目根目录下，如果不存在请手动创建。

3. **启动服务**

   构建并启动所有容器：
   ```bash
   docker-compose up -d --build
   ```

4. **验证部署**

   访问浏览器：
   - HTTP: `http://localhost` (或配置的域名)
   - HTTPS: `https://localhost` (如果启用)

   默认管理员账号（系统初始化时自动创建）：
   - 用户名: `admin`
   - 密码: `password`

### 数据持久化

MongoDB 数据将持久化存储在项目根目录下的 `mongodb_data/` 文件夹中。
请勿随意删除该文件夹，否则会导致数据丢失。

### 常用命令

- **查看服务状态**
  ```bash
  docker-compose ps
  ```

- **查看日志**
  ```bash
  docker-compose logs -f [service_name]
  # 示例: docker-compose logs -f backend
  ```

- **重启服务**
  ```bash
  docker-compose restart [service_name]
  ```

- **停止服务**
  ```bash
  docker-compose down
  ```

## 开发指南

### 基本使用
- 全局安装依赖：`pnpm install`
- 运行所有包的脚本（示例）：`pnpm -r run build`、`pnpm -r run test`
- 运行所有应用的开发脚本：`pnpm -r --filter ./apps/* run dev`

### 目录结构
```
apps/
  blog-frontend/  # Next.js App
  blog-server/    # Fastify Server
nginx/            # Nginx Configs
packages/         # Shared Packages
docker-compose.yml
.env
```
