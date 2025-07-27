//导入koa相关模块
const Router = require('@koa/router')
//导入工具
const { pool } = require('../utils/index')
//创建路由实例
const router = new Router()

//MySQL 查询语句
const getMoments = `
SELECT 
  moment.*, 
  user_without_password.*
FROM 
  moment
JOIN 
  user_without_password
ON 
  moment.user_id = user_without_password.uid;`
const insertMoment = 'insert into moment set ?'
const deleteMomentById = 'delete from moment where id =?'
const getTechnology = 'select * from technology'
const insertTechnology = 'insert into technology set ?'
const deleteTechnologyById = 'delete from technology where id =?'

//获取分享
router.get('/', async (ctx) => {
    try {
        const [rows] = await pool.query(getMoments)
        ctx.body = {
            code: 200,
            data: rows,
            msg: '获取分享成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取分享失败',
        }
    }
})
//添加分享
router.post('/addMoment', async (ctx) => {
    try {
        const moment = ctx.request.body
        const [rows] = await pool.query(insertMoment, moment)
        ctx.body = {
            code: 200,
            data: null,
            msg: '添加分享成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '添加分享失败',
            error:err,
        }
    }
})
//删除分享
router.delete('/deleteMoment', async (ctx) => {
    try {
        const moment = ctx.request.query
        const [rows] = await pool.query(deleteMomentById, moment.id)
        ctx.body = {
            code: 200,
            data: null,
            msg: '删除分享成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '删除分享失败',
        }
    }
})
//获取技术栈
router.get('/technology', async (ctx) => {
    try {
        const [rows] = await pool.query(getTechnology)
        ctx.body = {
            code: 200,
            data: rows,
            msg: '获取技术栈成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取技术栈失败',
        }
    }
})
//添加技术栈
router.post('/addTechnology', async (ctx) => {
    try {
        const technology = ctx.request.body
        const [rows] = await pool.query(insertTechnology, technology)
        ctx.body = {
            code: 200,
            data: null,
            msg: '添加技术栈成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '添加技术栈失败',
            error:err,
        }
    }
})
//删除技术栈
router.delete('/deleteTechnology', async (ctx) => {
    try {
        const technology = ctx.request.query
        const [rows] = await pool.query(deleteTechnologyById, technology.id)
        ctx.body = {
            code: 200,
            data: null,
            msg: '删除技术栈成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '删除技术栈失败',
        }
    }
})
module.exports = router