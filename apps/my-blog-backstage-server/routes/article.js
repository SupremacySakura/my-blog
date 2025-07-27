const Router = require('@koa/router')
const { pool,dealWithTag } = require('../utils/index')
const router = new Router()

//MySQL 查询语句
const getArticles = `
SELECT
  u.*,
  a.*,
  t.tag
FROM article a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
INNER JOIN user_without_password u ON a.user_id = u.uid
ORDER BY a.arid DESC;
`
const selectTagIdByName = 'select id from tag where tag = ?'
const insertTag = 'insert into tag set ?'
const insertArticleTag = 'insert into article_tag set ?'
const insertArticle = 'insert into article set ?'
const deleteArticleById = 'delete from article where id =?'
const deleteArticleTagById = 'delete from article_tag where article_id =?'
//获取文章
router.get('/', async (ctx) => {
    try {
        const [rows] = await pool.query(getArticles)
        ctx.body = {
            code: 200,
            data: dealWithTag(rows),
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
//添加文章
router.post('/addArticle', async (ctx) => {
    const connection = await pool.getConnection();  // 获取数据库连接
    try {
        await connection.beginTransaction();  // 开始事务
        const article = ctx.request.body
        const { label, ...articleWithoutLabel } = article;  // 提取 label 并将剩余部分放入 articleWithoutLabel
        const tagIndex = []
        for(let i = 0; i < label.length; i++){
            const [rows1] = await pool.query(selectTagIdByName,label[i])
            if(rows1[0]){
                tagIndex.push(rows1[0].id)
            }else{
                const [rows2] = await pool.query(insertTag,{tag:label[i]})
                tagIndex.push(rows2.insertId)
            }
        }
        
        const [rows] = await pool.query(insertArticle, articleWithoutLabel)
        const insertId = rows.insertId
        for(let i = 0; i < tagIndex.length; i++){
            const [rows3] = await pool.query(insertArticleTag,{article_id:insertId,tag_id:tagIndex[i]})
        }
        await connection.commit();  // 提交事务
        ctx.body = {
            code: 200,
            data: null,
            msg: '添加文章成功',
        }
    } catch (err) {
        console.error(err);
        await connection.rollback();  // 发生错误时回滚事务
        ctx.body = {
            code: 500,
            data: null,
            msg: '添加文章失败',
        }
    } finally {
        connection.release();  // 释放连接
    }
})
//删除文章
router.delete('/deleteArticle', async (ctx) => {
    try {
        const article = ctx.request.query
        const [rows] = await pool.query(deleteArticleById, article.id)
        const [rows1] = await pool.query(deleteArticleTagById, article.id)
        ctx.body = {
            code: 200,
            data: null,
            msg: '删除文章成功',
        }
    } catch (err) {
        ctx.body = {
            code: 500,
            data: null,
            msg: '删除文章失败',
        }
    }
})
module.exports = router