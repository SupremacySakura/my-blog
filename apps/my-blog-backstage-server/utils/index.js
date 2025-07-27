//导入mysql2模块
const mysql = require('mysql2/promise')

// 创建连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST, // 数据库地址
    user: process.env.DB_USER,      // 数据库用户名
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD, // 数据库密码
    database: process.env.DB_NAME, // 数据库名称
    waitForConnections: true,
})

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1'); // 不要传递回调
        console.log(
            JSON.stringify(rows[0]) === JSON.stringify({ '1': 1 })
                ? '数据库连接成功'
                : '数据库连接失败'
        )
    } catch (err) {
        console.error('数据库连接失败:', err.message)
    }
}

testConnection()
const dealWithTag = (result) => {
    // 创建标签关联对象
    const newTagArray = {};
    result.forEach(item => {
        if (!newTagArray[item.arid]) {
            newTagArray[item.arid] = [];
        }
        newTagArray[item.arid].push(item.tag);
    });

    // 创建新文章数组
    const newArticleArray = [];
    result.forEach(item => {
        // 如果文章没有被添加过（根据 ID 判断）
        if (!newArticleArray.some(article => article.arid === item.arid)) {
            const newArticle = { ...item, label: newTagArray[item.arid] };
            newArticleArray.push(newArticle);
        }
    });

    // 如果新数组长度小于 4，去除空值项
    return newArticleArray.filter(item => item);
}
module.exports = {
    pool,
    dealWithTag
}
