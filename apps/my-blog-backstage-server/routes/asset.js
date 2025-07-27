const Router = require('@koa/router')
const { pool } = require('../utils/index')
const router = new Router()

//MySQL 查询语句
const getAsset = 'select * from asset'

//获取相关信息
router.get('/', async (ctx) => {
    try {
        const [rows] = await pool.query(getAsset)
        ctx.body = {
            code: 200,
            data: rows[0],
            msg: '获取数据成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取数据失败',
        }
    }
})
module.exports = router