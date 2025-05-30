/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import type { HttpContext } from '@adonisjs/core/http' // <<< Import HttpContext di sini

router.on('/').render('home')
router.get('/chatbot', async ({ view }: HttpContext) => { // <<< Ubah di sini
  return view.render('chatbot')
}).as('chatbot')

// route API untuk chatbot
router.post("/api/chatbot/message", "#controllers/chatbots_controller.handleMessage")

router.get('/edukasi', async ({ view }: HttpContext) => { // <<< Ubah di sini
  return view.render('edukasi/index')
}).as('edukasi.index')

router.get('/edukasi/mitos-vs-fakta', async ({ view }: HttpContext) => { // <<< Ubah di sini
  return view.render('edukasi/mitos')
}).as('edukasi.mitos')

router.get('/edukasi/artikel', async ({ view }: HttpContext) => { // <<< Ubah di sini
  return view.render('edukasi/artikel')
}).as('edukasi.artikel')

router.get('/edukasi/forum', async ({ view }: HttpContext) => { // <<< Ubah di sini
  return view.render('edukasi/forum/index')
}).as('edukasi.forum')

router.get('/tentang', async ({ view }: HttpContext) => { // <<< Ubah di sini
  return view.render('tentang')
}).as('tentang')

// ==========================================
// ✅ AUTH ROUTES (OAuth2 - Google)
// ==========================================

// Route untuk memulai login ke Google
router.get('/auth/google', async ({ ally }: HttpContext) => { // <<< Ubah di sini
  return ally.use('google').redirect()
}).as('auth.google.redirect')

// Callback dari Google setelah login
router.get('/auth/google/callback', async ({ ally, response }: HttpContext) => { // <<< Ubah di sini
  const google = ally.use('google')

  if (google.accessDenied()) return response.unauthorized('Access denied')
  if (google.stateMisMatch()) return response.badRequest('State mismatch')
  if (google.hasError()) return response.badRequest(google.getError())

  const user = await google.user()

  if (!user.email) {
    return response.badRequest('Email not found from Google')
  }

  const User = (await import('#models/user')).default

  await User.firstOrCreate(
    { email: user.email },
    {
      fullName: user.name ?? user.email,
      email: user.email,
    }
  )

  return response.redirect('/chatbot')
}).as('auth.google.callback')

// ==========================================
// ✅ AUTH ROUTES (OAuth2 - Github)
// ==========================================

router.get('/auth/github', async ({ ally }: HttpContext) => { // <<< Ubah di sini
  return ally.use('github').redirect()
})

router.get('/auth/github/callback', async ({ ally, response }: HttpContext) => { // <<< Ubah di sini
  const github = ally.use('github')

  if (github.accessDenied()) return response.unauthorized('Access denied')
  if (github.stateMisMatch()) return response.badRequest('State mismatch')
  if (github.hasError()) return response.badRequest(github.getError())

  // simpan atau otentikasi user
  return response.redirect('/')
})

router.any('*', async ({ response }: HttpContext) => { // <<< Ubah di sini
  return response.notFound('Page not found')
})