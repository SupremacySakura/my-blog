require('dotenv').config()
import { Request, Response, NextFunction } from "express"
import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"

// 路由
import loginRouter from "./routes/login"
import messagesRouter from "./routes/messages"
import articlesRouter from "./routes/articles"
import momentsRouter from "./routes/moments"
import indexRouter from "./routes/asset"
import myRouter from "./routes/my"
import friendsRouter from "./routes/friends"
import userRouter from "./routes/user"

var app = express()


// view engine setup
app.use(logger('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://super-yxzq-blog.top',
  'http://42.193.0.33'
]
app.use(cors(
  {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    exposedHeaders: ['Authorization', 'refresh_token'] // 允许前端访问的响应头字段
  }
))
const apiRouter = express.Router()

apiRouter.use('/login', loginRouter)
apiRouter.use('/asset', indexRouter)
apiRouter.use('/messages', messagesRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/moments', momentsRouter)
apiRouter.use('/my', myRouter)
apiRouter.use('/friends', friendsRouter)
apiRouter.use('/user', userRouter)

app.use('/api', apiRouter)
// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || "Internal Server Error"

  res.status(status).json({
    success: false,
    message,
    error: req.app.get("env") === "development" ? err : {},
  })
})
const port = Number(process.env.PORT) || 5050
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
