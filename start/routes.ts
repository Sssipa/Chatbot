/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('home')
router.get('/chatbot', async ({ view }: { view: any }) => {
    return view.render('chatbot')
}).as('chatbot')

// route API untuk chatbot
router.post("/api/chatbot/message", "#controllers/chatbots_controller.handleMessage")

router.get('/edukasi', async ({ view }: { view: any }) => {
    return view.render('edukasi/index')
}).as('edukasi.index')

router.get('/edukasi/mitos-vs-fakta', async ({ view }: { view: any }) => {
    return view.render('edukasi/mitos')
}).as('edukasi.mitos')

router.get('/edukasi/artikel', async ({ view }: { view: any }) => {
    return view.render('edukasi/artikel')
}).as('edukasi.artikel')

router.get('/edukasi/forum', async ({ view }: { view: any }) => {
    return view.render('edukasi/forum/index')
}).as('edukasi.forum')

router.get('/tentang', async ({ view }: { view: any }) => {
    return view.render('tentang')
}).as('tentang')
