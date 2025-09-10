// 1.导入mysql2模块
const mysql = require('mysql2')
// 2.建立与MySQL数据库的连接
const pool = mysql.createPool({
  host: process.env.DB_HOST,//数据库的IP地址
  port: Number(process.env.DB_PORT),//端口号
  user: process.env.DB_USER,//登录数据库的账号
  password: process.env.DB_PASSWORD,//登录数据库的密码
  database: process.env.DB_NAME//指定需要操作哪个数据库
})
// 检测mysql模块是否正常工作
pool.query('SELECT 1', (err:any, result:any) => {
  if (err) return console.log(err.message)
  //只要能打印出[RowDataPacket{'1':1}]的结果,就证明数据库连接正常
  console.log(JSON.stringify(result[0]) === '{"1":1}' ? '数据库连接成功' : '数据库连接失败')
})
/**
 * 处理文章tag
 * @param {*} result 
 * @returns 处理后的文章列表
 */
const dealWithTag = (result:any) => {
  // 创建标签关联对象
  const newTagArray = {} as any
  result.forEach((item:any) => {
    if (!newTagArray[item.id]) {
      newTagArray[item.id] = []
    }
    newTagArray[item.id].push(item.tag)
  });

  // 创建新文章数组
  const newArticleArray = [] as any
  result.forEach((item:any) => {
    // 如果文章没有被添加过（根据 ID 判断）
    if (!newArticleArray.some((article:any) => article.arid === item.arid)) {
      const newArticle = { ...item, label: newTagArray[item.arid] }
      newArticleArray.push(newArticle)
    }
  });

  // 如果新数组长度小于 4，去除空值项
  return newArticleArray.filter((item:any) => item)
}
/**
 * 处理base64字符串
 * @param {*} base64String 
 * @returns 
 */
const parseBase64 = (base64String:any) => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/)
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string')
  }
  const mimeType = matches[1]
  const data = matches[2]
  return { mimeType, data }
}
export {
  pool,
  dealWithTag,
  parseBase64
}