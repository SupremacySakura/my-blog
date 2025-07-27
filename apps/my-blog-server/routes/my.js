const express = require('express')
const router = express.Router()
const { pool } = require('../utils/index')

// MySql 查询语句
const getMyInfo = `
SELECT m.*, u.*
FROM my AS m
INNER JOIN user_without_password AS u ON m.user_id = u.uid;`

const getLabels = `
SELECT
 t1.id,
 t1.text,
 t2_color.color AS color,
 t2_bg.color AS backgroundColor 
FROM 
 label t1 
JOIN 
 color t2_color ON t1.color_id = t2_color.id 
JOIN 
 color t2_bg ON t1.bc_id = t2_bg.id
`

// 查询个人信息自我介绍
router.get('/', (req, res) => {
  pool.query(getMyInfo, (err, result) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询主页失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询主页成功',
      data: result[0],
    }
    res.send(str)
  })
})
// 查询标签
router.get('/labels', (req, res) => {
  pool.query(getLabels, (err, result) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询标签失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询标签成功',
      data: result.slice().reverse(),
    }
    res.send(str)
  })
})
module.exports = router
