import express, { Request, Response } from "express";
import { pool, dealWithTag } from "../utils/index";

const router = express.Router();
// MySql 查询语句
const getArticlesCount = 'select count(*) from article'
const getArticlesByPage = `
SELECT a.*, t.tag, u.*
FROM (
  SELECT * FROM article a
  ORDER BY a.arid DESC
  LIMIT ? OFFSET ?
) AS a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
INNER JOIN user_without_password u ON a.user_id = u.uid;
`
const getArticlesCountByKeyWord = `
SELECT count(DISTINCT a.arid)
FROM(
  SELECT *
  FROM article a
  WHERE MATCH(a.head, a.digest, a.article, a.time, a.cover)
        AGAINST(?IN NATURAL LANGUAGE MODE)
) AS a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id;
`

const getArticleByKeyWord = `
SELECT a.*, t.tag
FROM (
  SELECT *
  FROM article a
  WHERE MATCH(a.head, a.digest, a.article, a.time, a.cover)
        AGAINST (? IN NATURAL LANGUAGE MODE)
  ORDER BY a.arid DESC
  LIMIT ? OFFSET ?
) AS a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
INNER JOIN user_without_password u ON a.user_id = u.uid;
`
const getArticleTag = `
SELECT * FROM tag
`
const getArticlesCountByTagId = (tagIdList: any) => {
  if (!Array.isArray(tagIdList) || tagIdList.length === 0) {
    return
  }

  if (tagIdList.length === 1) {
    return `
SELECT count(DISTINCT a.arid)
FROM 
 article a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
WHERE t.id = ?;
`
  }

  const placeholders = tagIdList.map(() => '?').join(',')
  return `
SELECT count(DISTINCT a.arid)
FROM 
 article a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
WHERE t.id IN (${placeholders});
`
}
const getArticleByTagId = (tagIdList: any) => {
  if (!Array.isArray(tagIdList) || tagIdList.length === 0) {
    return
  }
  if (tagIdList.length === 1) {
    return `
SELECT a.*, t.tag, u.*
FROM (
  SELECT * FROM article a
  ORDER BY a.arid DESC
) AS a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
INNER JOIN user_without_password u ON a.user_id = u.uid
WHERE t.id = ?;
`
  }

  const placeholders = tagIdList.map(() => '?').join(',')
  return `
SELECT a.*, t.tag
FROM (
  SELECT * FROM article a
  ORDER BY a.arid DESC
) AS a
INNER JOIN article_tag a_t ON a.arid = a_t.article_id
INNER JOIN tag t ON t.id = a_t.tag_id
INNER JOIN user_without_password u ON a.user_id = u.uid
WHERE t.id IN (${placeholders});
`
}
// 查询文章接口
router.get('/', (req: Request, res: Response) => {
  const page = req.query.page as any
  const pageStart = (page - 1) * 4
  const keyWord = req.query.keyWord
  let tagIdList = []
  if (req.query.tagIdList) {
    tagIdList = (req.query.tagIdList as any).map((item: any) => { return Number(item) })
  }

  try {
    if (keyWord && tagIdList.length === 0) {
      pool.query(getArticleByKeyWord, [keyWord, 4, pageStart], (err: any, result: any) => {
        if (err) {
          const str = {
            code: 400,
            message: '查询文章失败',
          }
          res.send(str)
          return console.log(err.message)
        }
        const newArticleArray = dealWithTag(result)
        const str = {
          code: 200,
          message: '查询文章成功',
          data: newArticleArray,
        }
        res.send(str)
      })
    } else if (tagIdList.length !== 0 && !keyWord) {
      pool.query(getArticleByTagId(tagIdList), [...tagIdList, 4, pageStart], (err: any, result: any) => {
        if (err) {
          const str = {
            code: 400,
            message: '查询文章失败',
          }
          res.send(str)
          return console.log(err.message)
        }
        const newArticleArray = dealWithTag(result)
        const str = {
          code: 200,
          message: '查询文章成功',
          data: newArticleArray.slice(pageStart, pageStart + 4),
        }
        res.send(str)
      })
    } else {
      pool.query(getArticlesByPage, [4, pageStart], (err: any, result: any) => {
        if (err) {
          const str = {
            code: 400,
            message: '查询文章失败',
          }
          res.send(str)
          return console.log(err.message)
        }
        const newArticleArray = dealWithTag(result)
        const str = {
          code: 200,
          message: '查询文章成功',
          data: newArticleArray,
        }
        res.send(str)
      })
    }
  } catch (err: any) {
    const str = {
      code: 400,
      message: '查询文章失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }

})
// 查询文章数量接口
router.get('/number', (req: Request, res: Response) => {
  const keyWord = req.query.keyWord
  let tagIdList = []
  if (req.query.tagIdList) {
    tagIdList = (req.query.tagIdList as any).map((item: any) => { return Number(item) })
  }
  try {
    if (keyWord && tagIdList.length === 0) {
      pool.query(getArticlesCountByKeyWord, [keyWord], (err: any, result: any) => {
        if (err) {
          const str = {
            code: 400,
            message: '查询文章数量失败',
            data: -1,
          }
          res.send(str)
          return console.log(err.message)
        }
        const str = {
          code: 200,
          message: '查询文章数量成功',
          data: result[0]['count(DISTINCT a.arid)'],
        }
        res.send(str)
      })
    } else if (tagIdList.length !== 0 && !keyWord) {
      pool.query(getArticlesCountByTagId(tagIdList), [...tagIdList], (err: any, result: any) => {
        if (err) {
          const str = {
            code: 400,
            message: '查询文章数量失败',
            data: -1,
          }
          res.send(str)
          return console.log(err.message)
        }
        const str = {
          code: 200,
          message: '查询文章数量成功',
          data: result[0]['count(DISTINCT a.arid)'],
        }
        res.send(str)
      })
    } else {
      pool.query(getArticlesCount, (err: any, result: any) => {
        if (err) {
          const str = {
            code: 400,
            message: '查询文章数量失败',
            data: -1,
          }
          res.send(str)
          return console.log(err.message)
        }
        const str = {
          code: 200,
          message: '查询文章数量成功',
          data: result[0]['count(*)'],
        }
        res.send(str)
      })
    }
  } catch (err: any) {
    const str = {
      code: 400,
      message: '查询文章数量失败',
      error: err.message
    }
    res.send(str)
    return console.log(err.message)
  }

})
// 查询文章标签接口
router.get('/tag', (req: Request, res: Response) => {
  pool.query(getArticleTag, (err: any, result: any) => {
    if (err) {
      const str = {
        code: 400,
        message: '查询文章标签失败',
      }
      res.send(str)
      return console.log(err.message)
    }
    const str = {
      code: 200,
      message: '查询文章标签成功',
      data: result,
    }
    res.send(str)
  })
})
export default router
