const Router = require('@koa/router')
const { pool } = require('../utils/index')
const router = new Router()

//MySQL 查询语句
const getMessages = `
SELECT
  m.*,
  u.*
FROM
  message m
INNER JOIN
  user_without_password u
ON
  m.user_id = u.uid;`
const deleteMessageById = 'delete from message where id =?'

//获取留言
router.get('/', async (ctx) => {
    try {
        const [rows] = await pool.query(getMessages)
        ctx.body = {
            code: 200,
            data: rows,
            msg: '获取留言成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取留言失败',
        }
    }
})
//删除留言
router.delete('/deleteMessage', async (ctx) => {
    try {
        const message = ctx.request.query
        const [rows] = await pool.query(deleteMessageById, message.id)
        ctx.body = {
            code: 200,
            data: null,
            msg: '删除留言成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '删除留言失败',
        }
    }
})
module.exports = router