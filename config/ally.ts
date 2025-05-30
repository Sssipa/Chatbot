import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'

const allyConfig = defineConfig({
  github: services.github({
    // Pastikan ini ada di .env Anda, jika tidak, tambahkan ! atau berikan nilai default
    clientId: env.get('GITHUB_CLIENT_ID')!,
    clientSecret: env.get('GITHUB_CLIENT_SECRET')!,
    callbackUrl: 'http://localhost:3333/github/callback',
  }),

  google: services.google({
    // Pastikan ini ada di .env Anda, jika tidak, tambahkan ! atau berikan nilai default
    clientId: env.get('GOOGLE_CLIENT_ID')!,
    clientSecret: env.get('GOOGLE_CLIENT_SECRET')!,
    callbackUrl: 'http://localhost:3333/auth/google/callback',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}