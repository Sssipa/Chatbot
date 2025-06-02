import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import Comment from 'App/Models/Comment'

export default class ForumController {
  /**
   * Menampilkan daftar semua postingan forum
   */
  public async index({ view }: HttpContextContract) {
    const posts = await Post.query().orderBy('created_at', 'desc')
    return view.render('forum/index', { posts })
  }

  /**
   * Menampilkan detail satu postingan dan komentar-komentarnya
   */
  public async show({ params, view }: HttpContextContract) {
    const post = await Post.query().where('id', params.id).preload('comments').firstOrFail()
    return view.render('forum/show', { post })
  }

  /**
   * Menampilkan form untuk membuat postingan baru (jika Anda ingin fitur ini)
   */
  public async create({ view }: HttpContextContract) {
    return view.render('forum/create')
  }

  /**
   * Menyimpan postingan baru ke database
   */
  public async store({ request, response, session }: HttpContextContract) {
    // Validasi input
    const { title, content } = request.only(['title', 'content'])

    if (!title || !content) {
      session.flash('error', 'Judul dan isi tidak boleh kosong.')
      return response.redirect().back()
    }

    // Diasumsikan Anda memiliki user yang login.
    // Jika tidak ada user login, Anda bisa hardcode user_id atau membuatnya nullable di migrasi
    const userId = 1 // Ganti dengan Auth.user?.id jika Anda menggunakan otentikasi

    await Post.create({ title, content, userId })

    session.flash('success', 'Pengalaman berhasil dibagikan!')
    return response.redirect().toRoute('forum.index')
  }

  /**
   * Menyimpan komentar baru untuk sebuah postingan
   */
  public async storeComment({ request, response, params, session }: HttpContextContract) {
    const postId = params.id
    const content = request.input('content')

    if (!content) {
      session.flash('error', 'Komentar tidak boleh kosong.')
      return response.redirect().back()
    }

    // Diasumsikan Anda memiliki user yang login.
    const userId = 1 // Ganti dengan Auth.user?.id jika Anda menggunakan otentikasi

    await Comment.create({ postId, content, userId })

    session.flash('success', 'Komentar berhasil ditambahkan!')
    return response.redirect().toRoute('forum.show', { id: postId })
  }
}