require('dotenv').config()
//导入koa相关中间件
const koa = require('koa')
const mount = require('koa-mount')
const static = require('koa-static')
const compose = require('koa-compose')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const { showRequest } = require('./middleware/index')
//导入其他模块
const path = require('path')
//导入路由
const homeRouter = require('./routes/home')
const assetRouter = require('./routes/asset')
const shareRouter = require('./routes/share')
const articleRouter = require('./routes/article')
const messageRouter = require('./routes/message')
const friendRouter = require('./routes/friend')
//创建app实例
const app = new koa()
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        ctx.status = err.status || 500
        ctx.body = err.message
    }
})
app.use(cors({
    origin: (ctx) => {
        return '*'
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))
app.use(bodyParser())
app.use(compose([showRequest]))
//挂载静态资源
app.use(mount('/static', static(path.resolve(__dirname + '/public'))))
//使用路由
app.use(mount('/home', homeRouter.routes())).use(homeRouter.allowedMethods())
app.use(mount('/asset', assetRouter.routes())).use(assetRouter.allowedMethods())
app.use(mount('/share', shareRouter.routes())).use(shareRouter.allowedMethods())
app.use(mount('/article', articleRouter.routes())).use(articleRouter.allowedMethods())
app.use(mount('/message', messageRouter.routes())).use(messageRouter.allowedMethods())
app.use(mount('/friend', friendRouter.routes())).use(friendRouter.allowedMethods())
const port = Number(process.env.PORT) || 5051
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})