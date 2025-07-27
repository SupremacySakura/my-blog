const express = require('express')
const router = express.Router()
const { pool } = require('../utils/index')

// MySql 查询语句
const getMoments = `SELECT m.*, u.*
FROM moment AS m
INNER JOIN user_without_password AS u ON m.user_id = u.uid; `
const getTechnology = 'select * from technology'

// 查询朋友圈接口
router.get('/', (req, res) => {
  pool.query(getMoments, (err, result) => {
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
router.get('/technology', (req, res) => {
  pool.query(getTechnology, (err, result) => {
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
module.exports = router
