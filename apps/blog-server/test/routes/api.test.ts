import { test } from 'node:test'
import assert from 'node:assert'
import Fastify from 'fastify'
import App from '../../src/app'

test('login checkRole without token should 401', async () => {
    const fastify = Fastify()
    await fastify.register(App)
    const res = await fastify.inject({
        method: 'POST',
        url: '/api/login/checkRole'
    })
    assert.strictEqual(res.statusCode, 401)
    fastify.close()
})
