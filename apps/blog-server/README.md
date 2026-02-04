# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

## 已迁移 API

- `/api/article` GET/POST/PUT/DELETE
- `/api/article/tag` GET/POST/PUT/DELETE
- `/api/login` POST，返回 Authorization/refreshToken/ownerToken（条件）
- `/api/login/refresh` POST，使用 refreshToken 刷新访问令牌
- `/api/login/checkRole` POST，校验 ownerToken
- `/api/register` POST，使用邮箱验证码注册
- `/api/register/verify` POST，发送邮箱验证码

## 环境变量

- `MONGODB_URI`：MongoDB 连接字符串
- `ACCESS_SECRET`：访问令牌密钥
- `REFRESH_SECRET`：刷新令牌密钥
- `OWNER_SECRET`：管理员令牌密钥
- `MAIL_HOST`、`MAIL_PORT`、`MAIL_USER`、`MAIL_PASS`：邮件服务配置
