import express, { Router, Request, Response, NextFunction } from "express";
import { pool } from "../utils";
import { verifyToken } from "../middlewares";

const router: Router = express.Router();
// MySql 查询语句
const getMessages = 'SELECT u.*,m.*  FROM message AS m JOIN user_without_password AS u ON m.user_id = u.uid ORDER BY m.id DESC LIMIT ? OFFSET ?'
const insertMessage = 'insert into message set ?'
const getMessagesCount = 'select count(*) from message'
const getDammu = `SELECT u.*,m.*  FROM message AS m JOIN user_without_password AS u ON m.user_id = u.uid ORDER BY m.id DESC LIMIT ? OFFSET ?`
// 查询留言接口
router.get('/', async (req:Request, res:Response) => {
  const page = req.query.page as any
  const pageStart = (page - 1) * 5
  pool.query(getMessages, [5, pageStart], (err:any, result:any) => {
    console.log(result)
    if (err) {
      const str = {
        code: 400,
        message: '查询留言失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询留言成功',
      data: result,
    }
    res.send(str)

  })
})
// 发表留言接口
router.post('/post', verifyToken, async (req:Request, res:Response) => {
  console.log(req.body)
  pool.query(insertMessage, req.body, (err:any, result:any) => {
    if (err) {
      const str = {
        code: 400,
        message: '发布留言失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '留言成功'
    }
    res.send(str)
  })

})
// 查询留言数量接口
router.get('/number', (req:Request, res:Response) => {
  pool.query(getMessagesCount, (err:any, result:any) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询留言数量失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询留言数量成功',
      data: result[0]['count(*)']
    }
    res.send(str)
  })
})
// 查询弹幕接口
router.get('/dammu', async (req:Request, res:Response) => {
  const page = req.query.page as any
  const pageStart = (page - 1) * 5
  pool.query(getDammu, [5, pageStart], (err:any, result:any) => {
    console.log(result)
    if (err) {
      const str = {
        code: 400,
        message: '查询留言失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询留言成功',
      data: result,
    }
    res.send(str)

  })
})
export default router
