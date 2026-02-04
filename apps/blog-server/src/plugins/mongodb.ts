import fp from 'fastify-plugin'
import { MongoClient, Db } from 'mongodb'

declare module 'fastify' {
    interface FastifyInstance {
        mongo: {
            client: MongoClient
            db: (name?: string) => Db
        }
    }
}

export default fp(async (fastify) => {
    const uri = fastify.config.MONGODB_URI || 'mongodb://localhost:27017'
    const client = new MongoClient(uri, {})
    await client.connect()

    fastify.decorate('mongo', {
        client,
        db: (name: string = 'MyBlog') => client.db(name)
    })

    fastify.addHook('onClose', async () => {
        await client.close()
    })
})
