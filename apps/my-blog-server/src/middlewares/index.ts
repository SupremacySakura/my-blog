import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

function verifyToken(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // 提取 Bearer token
    req.token = token
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }
    try {
        const decoded = jwt.verify(token, 'my-blog') // 使用你的密钥验证 token
        req.user = decoded // 将解码后的用户信息附加到请求对象上
        next() // 继续处理请求
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' })
    }
}
function verifyRefreshToken(req: any, res: Response, next: NextFunction) {
    const refreshHeader = req.headers['refresh_token']
    const token = refreshHeader // 提取 Bearer token
    req.token = token
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' })
    }
    try {
        const decoded = jwt.verify(token, 'my-blog-refresh') // 使用你的密钥验证 token
        req.user = decoded // 将解码后的用户信息附加到请求对象上
        next() // 继续处理请求
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token.' })
    }
}
export {
    verifyToken,
    verifyRefreshToken
}
