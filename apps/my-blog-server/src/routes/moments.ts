import express, { Router, Request, Response } from "express";
import { pool } from "../utils";
const router: Router = express.Router();

// MySql 查询语句
const getMoments = `SELECT m.*, u.*
FROM moment AS m
INNER JOIN user_without_password AS u ON m.user_id = u.uid; `
const getTechnology = 'select * from technology'

// 查询朋友圈接口
router.get('/', (req:Request, res:Response) => {
  pool.query(getMoments, (err:any, result:any) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询朋友圈失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询朋友圈成功',
      data: result.slice().reverse(),
    }
    res.send(str)
  })
})
// 查询技术栈接口
router.get('/technology', (req:Request, res:Response) => {
  pool.query(getTechnology, (err:any, result:any) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询技术栈失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询技术栈成功',
      data: result,
    }
    res.send(str)
  })
})
export default router
