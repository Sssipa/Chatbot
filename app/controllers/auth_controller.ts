// app/controllers/auth_controller.ts
import type { HttpContext } from "@adonisjs/core/http"
import User from "#models/user" //
import { registerValidator, loginValidator } from "#validators/auth" // Kita akan buat ini nanti
// import vine from '@vinejs/vine' //

export default class AuthController {
  /**
   * Display login form
   */
  async showLogin({ view }: HttpContext) {
    return view.render("auth/login") // Kita akan buat view ini nanti
  }

  /**
   * Handle login submission
   */
  async login({ request, response, auth, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator) // Validasi input

      const user = await User.verifyCredentials(email, password) // Memverifikasi kredensial
      await auth.use("web").login(user) // Melakukan login menggunakan guard 'web'

      // Add success message
      session.flash("success", "Login berhasil! Selamat datang kembali.")

      return response.redirect().toPath("/") // Redirect ke halaman utama setelah login
    } catch (error) {
      // Handle login errors
      session.flash("errors", {
        auth: "Email atau password tidak valid.",
      })
      return response.redirect().back()
    }
  }

  /**
   * Display registration form
   */
  async showRegister({ view }: HttpContext) {
    return view.render("auth/register") // Kita akan buat view ini nanti
  }

  /**
   * Handle registration submission
   */
  async register({ request, response, auth, session }: HttpContext) {
    try {
      const { fullName, email, password } = await request.validateUsing(registerValidator) // Validasi input

      const user = await User.create({ fullName, email, password }) // Membuat user baru
      await auth.use("web").login(user) // Melakukan login setelah register

      // Add success message
      session.flash("success", "Registrasi berhasil! Selamat datang di TinyBoss.")

      return response.redirect().toPath("/") // Redirect ke halaman utama setelah register
    } catch (error) {
      // Handle registration errors
      session.flash("errors", {
        general: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
      })
      return response.redirect().back()
    }
  }

  /**
   * Handle logout
   */
  async logout({ auth, response, session }: HttpContext) {
    try {
      await auth.use("web").logout() // Melakukan logout dari guard 'web'

      // Clear any existing session data
      session.clear()

      // Add logout success message
      session.flash("success", "Anda telah berhasil logout. Sampai jumpa!")

      // Redirect to homepage instead of login page
      return response.redirect().toPath("/") // Redirect ke halaman beranda setelah logout
    } catch (error) {
      // Handle logout errors
      session.flash("error", "Terjadi kesalahan saat logout.")
      return response.redirect().toPath("/")
    }
  }
}
