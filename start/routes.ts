// sssipa/chatbot/Chatbot-master/start/routes.ts
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from "@adonisjs/core/services/router"
import { middleware } from "#start/kernel" // Pastikan ini sudah ada
import { DateTime } from "luxon"
import ChatHistory from "#models/chat_history"

// Routes untuk autentikasi
router
    .get("/login", async ({ view }) => {
        return view.render("auth/login")
    })
    .as("auth.login")
router.post("/login", "#controllers/auth_controller.login")

router
    .get("/register", async ({ view }) => {
        return view.render("auth/register")
    })
    .as("auth.register")
router.post("/register", "#controllers/auth_controller.register")

// Pastikan rute logout menggunakan POST dan dilindungi jika diperlukan,
// atau biarkan terbuka agar siapa pun bisa logout. Untuk sekarang, biarkan POST.
router.post("/logout", "#controllers/auth_controller.logout").as("auth.logout")

// Public routes with optional authentication (untuk konsistensi navbar)
router
    .group(() => {
        router
            .get("/", async ({ view }) => {
                // Get testimonials data
                const comments = [
                    {
                        message: "Layanan yang luar biasa! Sangat membantu saya dalam perjalanan sebagai orang tua.",
                        avatar: "https://i.pravatar.cc/100?img=1",
                        name: "Diana Putri",
                        role: "Ibu Rumah Tangga",
                    },
                    {
                        message: "Forum ini sangat informatif. Saya mendapatkan banyak wawasan baru tentang parenting.",
                        avatar: "https://i.pravatar.cc/100?img=2",
                        name: "Randy Saputra",
                        role: "Ayah Muda",
                    },
                    {
                        message: "Mudah sekali berinteraksi dengan sesama orang tua, dan banyak tips yang sangat bermanfaat.",
                        avatar: "https://i.pravatar.cc/100?img=3",
                        name: "Hani Fadilah",
                        role: "Ibu Kerja",
                    },
                    {
                        message: "Saya merasa lebih percaya diri sebagai orang tua setelah mengikuti diskusi di forum ini.",
                        avatar: "https://i.pravatar.cc/100?img=4",
                        name: "Budi Santoso",
                        role: "Ayah dan Profesional",
                    },
                ]

                return view.render("home", { comments })
            })
            .as("home")

        router
            .get("/chatbot", async ({ view, auth, request }) => {
                let chatHistories = [];
                if (auth.user) {
                    chatHistories = await ChatHistory.query()
                        .where('user_id', auth.user.id.toString())
                        .orderBy('createdAt', 'desc')
                        .limit(10);
                } else {
                    chatHistories = await ChatHistory.query()
                        .where('user_id', 'anonymous')
                        .orderBy('createdAt', 'desc')
                        .limit(10);
                }
                return view.render("chatbot", {
                    chatHistories,
                    DateTime: DateTime,
                    request: request
                });
            })
            .as("chatbot");

        router
            .get("/edukasi", async ({ view }) => {
                return view.render("edukasi/index")
            })
            .as("edukasi.index")

        router
            .get("/edukasi/mitos-vs-fakta", async ({ view }) => {
                return view.render("edukasi/mitos")
            })
            .as("edukasi.mitos")

        router
            .get("/edukasi/artikel", async ({ view }) => {
                return view.render("edukasi/artikel")
            })
            .as("edukasi.artikel")

        router
            .get("/tentang", async ({ view }) => {
                return view.render("tentang")
            })
            .as("tentang")
    })
    .use(middleware.optionalAuth()) // Menggunakan optional auth untuk semua halaman publik

// route API untuk chatbot
router.post("/api/chatbot/message", "#controllers/chatbots_controller.handleMessage")

// Rute untuk forum yang memerlukan login
router
    .group(() => {
        router
            .get("/edukasi/forum", async ({ view }) => {
                return view.render("edukasi/forum/index")
            })
            .as("edukasi.forum.index")
        router.post("/edukasi/forum/:threadId/reply", async ({ response }) => {
            // Logika untuk membalas komentar, pastikan user sudah login
            return response.json({ message: "Reply posted!" })
        })
    })
    .use(middleware.auth())

// ===========================================
// Rute untuk Halaman Profil (baru ditambahkan)
// ===========================================
router
    .group(() => {
        router
            .get("/profile", async ({ view, auth }) => {
                // Mengirimkan data user yang sedang login ke view
                const user = auth.user
                return view.render("profile/index", { user, DateTime })
            })
            .as("profile.show")
    })
    .use(middleware.auth()) // Hanya user yang sudah login yang bisa mengakses halaman profile
