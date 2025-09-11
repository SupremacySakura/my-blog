import express, { Request, Response } from "express"
const router = express.Router()

// 查询时间接口
router.get('/time', (req: Request, res: Response) => {
  res.send({
    code: 200,
    message: '查询成功',
    data: new Date('2024-11-01 00:00:00')
  })
})
// 查询访问次数
router.get('/people', (req: Request, res: Response) => {
  const str = {
    code: 200,
    message: '查询人数成功',
    data: 4000,
  }
  res.send(str)
})
// 访问请求
router.post('/get', (req: Request, res: Response) => {
  const str = {
    code: 200,
    message: '访问成功',
  }
  res.send(str)
})
export default router
