/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import Route from '@ioc:Adonis/Core/Route'

// Rute untuk Forum
Route.group(() => {
  Route.get('/', 'ForumController.index').as('forum.index') // Menampilkan daftar postingan
  Route.get('/create', 'ForumController.create').as('forum.create') // Form untuk membuat postingan baru
  Route.post('/', 'ForumController.store').as('forum.store') // Menyimpan postingan baru
  Route.get('/:id', 'ForumController.show').as('forum.show') // Menampilkan detail postingan
  Route.post('/:id/comments', 'ForumController.storeComment').as('forum.storeComment') // Menyimpan komentar
}).prefix('/forum') // Semua rute forum akan diawali dengan /forum

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

