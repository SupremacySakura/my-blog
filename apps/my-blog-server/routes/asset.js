const express = require('express')
const router = express.Router()
const { pool } = require('../utils/index')

// MySql 查询语句
const getTime = 'select * from asset where id=1'
const getPeopleNumber = 'select * from asset where id=1'
const postPeopleVisit = 'update asset set people = ? where id = 1'

// 查询时间接口
router.get('/time', (req, res) => {
  pool.query(getTime, (err, result) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询时间失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询时间成功',
      data: result[0].time,
    }
    res.send(str)
  })
})
// 查询访问次数
router.get('/people', (req, res) => {
  pool.query(getPeopleNumber, (err, result) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询人数失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询人数成功',
      data: result[0].people,
    }
    res.send(str)
  })
})
// 访问请求
router.post('/get', (req, res) => {
  pool.query(getPeopleNumber, (err, result) => {
    if (err) {
      const str = {
        code: 400,
        message: '访问失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    people = result[0].people + 1
    pool.query(postPeopleVisit, people, (err, result) => {
      if (err) {
        const str = {
          code: 400,
          message: '访问失败',
        }
        res.send(str)
        return console.log(err.message)
      }
      const str = {
        code: 200,
        message: '访问成功',
      }
      res.send(str)
    })

  })
})
module.exports = router
