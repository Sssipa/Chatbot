// app/controllers/auth_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user' //
import { registerValidator, loginValidator } from '#validators/auth' // Kita akan buat ini nanti
// import vine from '@vinejs/vine' //

export default class AuthController {
  /**
   * Display login form
   */
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login') // Kita akan buat view ini nanti
  }

  /**
   * Handle login submission
   */
  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator) // Validasi input

    const user = await User.verifyCredentials(email, password) // Memverifikasi kredensial
    await auth.use('web').login(user) // Melakukan login menggunakan guard 'web'

    return response.redirect().toPath('/') // Redirect ke halaman utama setelah login
  }

  /**
   * Display registration form
   */
  async showRegister({ view }: HttpContext) {
    return view.render('auth/register') // Kita akan buat view ini nanti
  }

  /**
   * Handle registration submission
   */
  async register({ request, response, auth }: HttpContext) {
    const { fullName, email, password } = await request.validateUsing(registerValidator) // Validasi input

    const user = await User.create({ fullName, email, password }) // Membuat user baru
    await auth.use('web').login(user) // Melakukan login setelah register

    return response.redirect().toPath('/') // Redirect ke halaman utama setelah register
  }

  /**
   * Handle logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout() // Melakukan logout dari guard 'web'
    return response.redirect().toPath('/login') // Redirect kembali ke halaman login
  }
}