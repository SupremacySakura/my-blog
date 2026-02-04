import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import { FastifyReply, FastifyRequest } from 'fastify'

// Token options
const accessOptions = { expiresIn: 10 * 60 }
const refreshOptions = { expiresIn: 7 * 24 * 60 * 60 }

declare module 'fastify' {
  interface FastifyInstance {
    verifyAccess: (req: FastifyRequest, reply: FastifyReply) => boolean;
    verifyRefresh: (req: FastifyRequest, reply: FastifyReply) => boolean;
    verifyOwner: (req: FastifyRequest, reply: FastifyReply) => boolean;
    signAccess: (payload: any) => string;
    signRefresh: (payload: any) => string;
    signOwner: (payload: any) => string;
  }
}

export default fp(async (fastify) => {
  const { ACCESS_SECRET, REFRESH_SECRET, OWNER_SECRET } = fastify.config

  // Verify functions
  fastify.decorate('verifyAccess', (req: FastifyRequest, reply: FastifyReply) => {
    const auth = req.headers['authorization']
    const token = typeof auth === 'string' ? auth.split(' ')[1] : undefined
    if (!token) {
      reply.code(401).send({ error: 'No token provided' })
      return false
    }
    try {
      (req as any).user = jwt.verify(token, ACCESS_SECRET)
      return true
    } catch {
      reply.code(403).send({ error: 'Invalid token' })
      return false
    }
  })

  fastify.decorate('verifyRefresh', (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers['refreshtoken']
    if (!token || typeof token !== 'string') {
      reply.code(401).send({ error: 'Access denied. No token provided.', code: 401 })
      return false
    }
    try {
      (req as any).refreshUser = jwt.verify(token, REFRESH_SECRET)
      return true
    } catch {
      reply.code(403).send({ error: 'Invalid token.', code: 403 })
      return false
    }
  })

  fastify.decorate('verifyOwner', (req: FastifyRequest, reply: FastifyReply) => {
    const token = req.headers['ownertoken']
    if (!token || typeof token !== 'string') {
      reply.code(401).send({ error: 'Access denied. No token provided.', code: 401 })
      return false
    }
    try {
      (req as any).ownerUser = jwt.verify(token, OWNER_SECRET)
      return true
    } catch {
      reply.code(403).send({ error: 'Invalid token.', code: 403 })
      return false
    }
  })

  // Sign functions
  fastify.decorate('signAccess', (payload: any) => {
    return jwt.sign(payload, ACCESS_SECRET, accessOptions)
  })

  fastify.decorate('signRefresh', (payload: any) => {
    return jwt.sign(payload, REFRESH_SECRET, refreshOptions)
  })

  fastify.decorate('signOwner', (payload: any) => {
    return jwt.sign(payload, OWNER_SECRET, refreshOptions) // Note: original code used refreshOptions for owner token
  })
})
