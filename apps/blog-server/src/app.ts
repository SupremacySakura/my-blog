import { join } from 'node:path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync, FastifyServerOptions } from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod'
import env from '@fastify/env'

const envJsonSchema = {
  type: 'object',
  required: ['MONGODB_URI', 'MAIL_HOST', 'MAIL_PORT', 'MAIL_USER', 'MAIL_PASS', 'ACCESS_SECRET', 'REFRESH_SECRET', 'OWNER_SECRET'],
  properties: {
    MONGODB_URI: { type: 'string' },
    MAIL_HOST: { type: 'string' },
    MAIL_PORT: { type: 'number' },
    MAIL_USER: { type: 'string' },
    MAIL_PASS: { type: 'string' },
    ACCESS_SECRET: { type: 'string' },
    REFRESH_SECRET: { type: 'string' },
    OWNER_SECRET: { type: 'string' }
  }
}
export interface AppOptions extends FastifyServerOptions, Partial<AutoloadPluginOptions> {

}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  void fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization','ownerToken','refreshToken','accessToken'],
    exposedHeaders:['Authorization','ownerToken','refreshToken','accessToken']
  })
  void fastify.setValidatorCompiler(validatorCompiler)
  void fastify.setSerializerCompiler(serializerCompiler)

  void fastify.register(env, {
    schema: envJsonSchema,
    dotenv: true
  })

   // Register Swagger
  void fastify.register(swagger, {
    openapi: {
      info: {
        title: 'My Blog API',
        description: 'API documentation for My Blog',
        version: '1.0.0'
      },
      servers: []
    },
    transform: jsonSchemaTransform
  })

  // Register Swagger UI
  void fastify.register(swaggerUI, {
    routePrefix: '/docs',
  })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: opts
  })
}

export default app
export { app, options }
