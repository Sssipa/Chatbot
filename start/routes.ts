import router from "@adonisjs/core/services/router"
import { middleware } from "#start/kernel"
import { DateTime } from "luxon"
import ChatHistory from "#models/chat_history"
import MitosFaktasController from '#controllers/mitos_faktas_controller'
import ArtikelController from '#controllers/artikels_controller'
import HomeController from '#controllers/home_controller'
import ForumsController from '#controllers/forums_controller'
import ChatbotController from "#controllers/chatbots_controller"

// ====================
// Routes untuk autentikasi
// ====================
router
.get("/login", async ({ view }) => view.render("auth/login"))
.as("auth.login")
router.post("/login", "#controllers/auth_controller.login")
router
.get("/register", async ({ view }) => view.render("auth/register"))
.as("auth.register")
router.post("/register", "#controllers/auth_controller.register")
router.post("/logout", "#controllers/auth_controller.logout").as("auth.logout")

// ====================
// Public routes
// ====================
router
.group(() => {
    router.get("/", [HomeController, "index"]).as("home")

    router.get("/chatbot", async ({ view, auth, request }) => {
    let chatHistories = []
    if (auth.user) {
        chatHistories = await ChatHistory.query()
        .where('user_id', auth.user.id.toString())
        .orderBy('createdAt', 'desc')
        .limit(10)
    } else {
        chatHistories = await ChatHistory.query()
        .where('user_id', 'anonymous')
        .orderBy('createdAt', 'desc')
        .limit(10)
    }
    return view.render("chatbot", { chatHistories, DateTime, request })
    }).as("chatbot")

    // ====================
    // EDUKASI & ARTIKEL
    // ====================
    router.get("/edukasi", async ({ view }) => view.render("edukasi/index")).as("edukasi.index")

    // Ganti endpoint artikel dengan controller
    router.get("/artikel", async ({ view }) => view.render("artikel/index")).as("artikel.index")
    router.get("/artikel/:id", [ArtikelController, "show"]).as("artikel.show")

    router.get("/tentang", async ({ view }) => view.render("tentang")).as("tentang")
    router.get("/mitos-fakta", async ({ view }) => view.render("mitos-fakta")).as("mitos-fakta")
})
.use(middleware.optionalAuth())

// ====================
// API routes
// ====================
router.get('/api/mitos-fakta', [MitosFaktasController, 'index'])
router.post("/api/chatbot/message", [ChatbotController, "handleMessage"]).use(middleware.auth())

// API untuk data artikel (misal frontend pakai fetch)
router.get('/api/artikel', [ArtikelController, "index"])
router.get('/api/artikel/:id', [ArtikelController, "show"])
router.get('/api/forum', [ForumsController, "apiIndex"])

// ====================
// Profil (hanya login)
// ====================
router
.group(() => {
    router.get("/profile", async ({ view, auth }) => {
    const user = auth.user
    return view.render("profile/index", { user, DateTime })
    }).as("profile.show")
})
.use(middleware.auth())

// ====================
// Forum (hanya login untuk create/post)
// ====================
router
.group(() => {
// List semua postingan forum
router.get('/forum', [ForumsController, 'index']).as('forum.index')

// Form buat postingan baru
router.get('/forum/create', [ForumsController, 'create']).as('forum.create')

// Simpan postingan baru
router.post('/forum', [ForumsController, 'store']).as('forum.store')

// Detail postingan + komentar
router.get('/forum/:id', [ForumsController, 'show']).as('forum.show')

// Simpan komentar pada postingan
router.post('/forum/:id/comment', [ForumsController, 'storeComment']).as('forum.storeComment')
})
.use(middleware.auth())
