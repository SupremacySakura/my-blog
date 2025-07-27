const Router = require('@koa/router')
const { pool } = require('../utils/index')
const router = new Router()

//MySQL 查询语句
const getFriends = `
SELECT
  f.*,
  u.*
FROM
  friend f
INNER JOIN
  user_without_password u
ON
  f.user_id = u.uid;`
const insertFriend = 'insert into friend set ?'
const deleteFriendById = 'delete from friend where id =?'
const changeStatusById = 'update friend set status = ? where id =?'
//获取朋友
router.get('/', async (ctx) => {
    try {
        const [rows] = await pool.query(getFriends)
        ctx.body = {
            code: 200,
            data: rows,
            msg: '获取朋友成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取朋友失败',
        }
    }
})
//添加朋友
router.post('/addFriend', async (ctx) => {
    try {
        const friend = ctx.request.body
        const [rows] = await pool.query(insertFriend, friend)
        ctx.body = {
            code: 200,
            data: null,
            msg: '添加朋友成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '添加朋友失败',
        }
    }
})
//删除朋友
router.delete('/deleteFriend', async (ctx) => {
    try {
        const friend = ctx.request.query
        const [rows] = await pool.query(deleteFriendById, friend.id)
        ctx.body = {
            code: 200,
            data: null,
            msg: '删除朋友成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '删除朋友失败',
        }
    }
})
//更新朋友状态
//添加朋友
router.post('/changeFriendStatus', async (ctx) => {
    try {
        const { id, status } = ctx.request.body
        const [rows] = await pool.query(changeStatusById, [status, id])
        ctx.body = {
            code: 200,
            data: null,
            msg: '更新成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '更新失败',
        }
    }
})
module.exports = router