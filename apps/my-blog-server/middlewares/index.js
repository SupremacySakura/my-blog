const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]; // 提取 Bearer token
    req.token = token
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }
    try {
        const accessOptions = {
            expiresIn: '10m'
        }
        const decoded = jwt.verify(token, 'my-blog', accessOptions) // 使用你的密钥验证 token
        req.user = decoded // 将解码后的用户信息附加到请求对象上
        next() // 继续处理请求
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' })
    }
}
function verifyRefreshToken(req, res, next) {
    const refreshHeader = req.headers['refresh_token']
    const token = refreshHeader; // 提取 Bearer token
    req.token = token
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }
    try {
        const refreshOptions = {
            expiresIn: '7d'
        }
        const decoded = jwt.verify(token, 'my-blog-refresh', refreshOptions) // 使用你的密钥验证 token
        req.user = decoded // 将解码后的用户信息附加到请求对象上
        next() // 继续处理请求
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' })
    }
}
module.exports = {
    verifyToken,
    verifyRefreshToken
};
