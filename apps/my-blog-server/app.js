require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const loginRouter = require('./routes/login')
const messagesRouter = require('./routes/messages')
const articlesRouter = require('./routes/articles')
const momentsRouter = require('./routes/moments')
const indexRouter = require('./routes/asset')
const myRouter = require('./routes/my')
const friendsRouter = require('./routes/friends')
const userRouter = require('./routes/user')
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
    origin: (origin, callback) => {
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
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
})
const port = Number(process.env.PORT) || 5050
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`)
})
