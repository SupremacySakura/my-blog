import fp from 'fastify-plugin'
import nodemailer from 'nodemailer'

declare module 'fastify' {
  interface FastifyInstance {
    sendVerificationEmail: (to: string, code: string) => Promise<any>;
  }
}

export default fp(async (fastify) => {
  const transporter = nodemailer.createTransport({
    host: fastify.config.MAIL_HOST,
    port: fastify.config.MAIL_PORT,
    secure: true,
    auth: {
      user: fastify.config.MAIL_USER,
      pass: fastify.config.MAIL_PASS
    }
  })

  fastify.decorate('sendVerificationEmail', async (to: string, code: string) => {
    const mailOptions = {
      from: '"余心知秋" <3118654731@qq.com>',
      to,
      subject: '邮箱验证码',
      html: `<p>您的验证码是：<strong>${code}</strong></p>`
    }
    return transporter.sendMail(mailOptions)
  })
})
