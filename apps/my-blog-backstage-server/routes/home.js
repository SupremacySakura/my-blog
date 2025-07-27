//导入koa相关模块
const Router = require('@koa/router')
const { koaBody } = require('koa-body')
//导入工具
const { pool } = require('../utils/index')
const { uploadResource } = require('yxzq-utils-node')
//导入nodejs模块
const fs = require('fs')
const path = require('path')
//创建路由实例
const router = new Router()

//MySQL 查询语句
const getColorByStr = 'SELECT * FROM color WHERE color = ?'
const insertColor = 'insert into color set color = ?'
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
const insertLabel = 'insert into label set ?'
const deleteLabelById = 'delete from label where id =?'
const getMyInfo = `
SELECT
  m.*,
  u.*
FROM
  my m
INNER JOIN
  user_without_password u
ON
  m.user_id = u.uid;`
const updateMyArticle = 'update my set content = ? where id = 1'
const updateMyAvatar = 'update my set userHeadPortrait = ? where id = 1'

//获取标签
router.get('/tag', async (ctx) => {
    try {
        const [rows] = await pool.query(getLabels)
        ctx.body = {
            code: 200,
            data: rows,
            msg: '获取标签成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取标签失败',
        }
    }
})
//添加标签
router.post('/addTag', async (ctx) => {
    try {
        const tag = ctx.request.body
        const addTag = {
            text: tag.text,
        }
        //查询字体颜色和背景颜色是否存在
        const [rows1] = await pool.query(getColorByStr, tag.color)
        if (!rows1.length) {
            const [rows2] = await pool.query(insertColor, tag.color)
            addTag.color_id = rows2.insertId
        } else {
            addTag.color_id = rows1[0].id
        }
        const [rows3] = await pool.query(getColorByStr, tag.backgroundColor)
        if (!rows3.length) {
            const [rows4] = await pool.query(insertColor, tag.backgroundColor)
            addTag.bc_id = rows4.insertId
        } else {
            addTag.bc_id = rows3[0].id
        }

        const [rows] = await pool.query(insertLabel, addTag)
        ctx.body = {
            code: 200,
            data: null,
            msg: '添加标签成功'
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '添加标签失败'
        }
    }
})
//删除标签
router.delete('/deleteTag', async (ctx) => {
    try {
        const tag = ctx.request.query
        const [rows] = await pool.query(deleteLabelById, tag.id)
        ctx.body = {
            code: 200,
            data: null,
            msg: '删除标签成功'
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '删除标签失败'
        }
    }
})
//获取我的文章
router.get('/myArticle', async (ctx) => {
    try {
        const [rows] = await pool.query(getMyInfo)
        ctx.body = {
            code: 200,
            data: rows[0].content,
            msg: '获取文章成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取文章失败',
        }
    }
})
//更新文章
router.post('/updateMyArticle', koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024,
    }
}), async (ctx) => {
    const file = ctx.request.files.file
    if (file) {
        try {
            const content = fs.readFileSync(file.filepath, 'utf-8')
            const [rows] = await pool.query(updateMyArticle, content)
            ctx.body = {
                code: 200,
                data: null,
                msg: '更新文章成功'
            }
        } catch (err) {
            ctx.body = {
                code: 500,
                msg: '更新文章失败',
                error: err.message,
            }
        }
    } else {
        ctx.body = {
            code: 400,
            msg: '请求参数错误',
        }
    }
}
)
//获取头像
router.get('/myHeadPortrait', async (ctx) => {
    try {
        const [rows] = await pool.query(getMyInfo)
        ctx.body = {
            code: 200,
            data: rows[0].userHeadPortrait,
            msg: '获取头像成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取头像失败',
        }
    }
})
//更新头像
router.post('/updateMyHeadPortrait', koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '.././temp'), // 临时文件存储路径
        keepExtensions: true, // 保留文件扩展名
    }
}), async (ctx) => {
    const file = ctx.request.files.file  // 获取上传文件
    const folderName = 'blog'
    if (!file) {
        return ctx.body = {
            code: 500,
            msg: '上传文件失败',
            error: '未接收到文件'
        }
    }
    try {
        const res = await uploadResource(fs.createReadStream(file.filepath), {
            fileName: 'yxzq',
            folderName: folderName,
            url: 'http://super-yxzq-blog.top:3100',
            useDate: 'no',
            ext: 'jpg'
        })
        console.log(res)
        if (!res.filePath) {
            return ctx.body = {
                code: 500,
                msg: '上传文件失败',
                error: '没有返回文件路径',
            }

        }
        const [rows] = await pool.query(updateMyAvatar, res.filePath)
        if (!rows.affectedRows) {
            return ctx.body = {
                code: 500,
                msg: '更新数据库失败',
                error: '没有影响的行',
            }

        }
        try {
            fs.promises.unlink(file.filepath)
            console.log('删除临时文件成功')
        } catch (err) {
            console.log('删除临时文件失败', err)
        }
        ctx.body = {
            code: 200,
            msg: '上传文件成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            msg: '上传文件失败',
            error: err.message,
        }
    }

}
)
//获取信息
router.get('/myInfo', async (ctx) => {
    try {
        const [rows] = await pool.query(getMyInfo)
        ctx.body = {
            code: 200,
            data: rows[0],
            msg: '获取信息成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '获取信息失败',
        }
    }
})
module.exports = router