import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
     config: {
          MONGODB_URI: string;
          MAIL_HOST: string;
          MAIL_PORT: number;
          MAIL_USER: string;
          MAIL_PASS: string;
          ACCESS_SECRET: string;
          REFRESH_SECRET: string;
          OWNER_SECRET: string;
        };
  }
}
