// sssipa/chatbot/Chatbot-master/start/routes.ts
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Routes untuk autentikasi
router.get('/login', async ({ view }) => {
    return view.render('auth/login')
}).as('auth.login')
router.post('/login', '#controllers/auth_controller.login') //

router.get('/register', async ({ view }) => {
    return view.render('auth/register')
}).as('auth.register')
router.post('/register', '#controllers/auth_controller.register') //

router.post('/logout', '#controllers/auth_controller.logout').as('auth.logout') //

// Rute yang sebelumnya sudah ada
router.on('/').render('home')
router.get('/chatbot', async ({ view }: { view: any }) => {
    return view.render('chatbot')
}).as('chatbot')

// route API untuk chatbot
router.post("/api/chatbot/message", "#controllers/chatbots_controller.handleMessage") //

router.get('/edukasi', async ({ view }: { view: any }) => {
    return view.render('edukasi/index')
}).as('edukasi.index')

router.get('/edukasi/mitos-vs-fakta', async ({ view }: { view: any }) => {
    return view.render('edukasi/mitos')
}).as('edukasi.mitos')

router.get('/edukasi/artikel', async ({ view }: { view: any }) => {
    return view.render('edukasi/artikel')
}).as('edukasi.artikel')

// Rute untuk forum yang memerlukan login
router.group(() => {
    router.get('/edukasi/forum', async ({ view }: { view: any }) => {
        return view.render('edukasi/forum/index')
    }).as('edukasi.forum') // Ubah nama rute untuk kejelasan
    // Contoh rute untuk membalas komentar di forum yang memerlukan login
    router.post('/edukasi/forum/:threadId/reply', async ({ response }) => {
        // Logika untuk membalas komentar, pastikan user sudah login
        return response.json({ message: 'Reply posted!' })
    })
}).use(middleware.auth()) // Terapkan middleware auth untuk group ini

router.get('/tentang', async ({ view }: { view: any }) => {
    return view.render('tentang')
}).as('tentang')