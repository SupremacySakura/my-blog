import { FastifyPluginAsync } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { AppOptions } from "../app"

export type AppPluginAsync = FastifyPluginAsync<AppOptions, never, ZodTypeProvider>