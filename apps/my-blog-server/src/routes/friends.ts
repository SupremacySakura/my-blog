import express, { Request, Response } from "express";
import { pool } from "../utils";

const router = express.Router();
// MySql 查询语句
const getFriends = `
  SELECT u.*, f.*
  FROM friend AS f
  JOIN user_without_password AS u ON f.user_id = u.uid
  WHERE f.status = 1;
`
const insertFriend = 'insert into friend set ?'
const getNotice = 'select * from notice'
// 查询友链
router.get('/', (req: Request, res: Response) => {
  pool.query(getFriends, (err: any, result: any) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询朋友失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询朋友成功',
      data: result,
    }
    res.send(str)
  })
})
// 申请友链
router.post('/apply', async (req: Request, res: Response) => {
  const newFriend = {
    user_id: req.body.user_id,
    name: req.body.name,
    label: req.body.label,
    url: req.body.url
  }
  pool.query(insertFriend, newFriend, (err: any, result: any) => {
    if (err) {
      const str = {
        code: 400,
        message: '申请友链失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '申请友链成功',
      data: result,
    }
    res.send(str)
  })
})
// 查询公告
router.get('/notice', (req: Request, res: Response) => {
  pool.query(getNotice, (err: any, result: any) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询公告失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询公告成功',
      data: result,
    }
    res.send(str)
  })
})
export default router
