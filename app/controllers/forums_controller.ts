import type { HttpContext } from '@adonisjs/core/http'
import Post from '#models/post'
import Comment from '#models/forum_komentar'

export default class ForumsController {
// Menampilkan daftar semua postingan forum
public async index({ view }: HttpContext) {
    const posts = await Post.query()
        .preload('user')
        .orderBy('created_at', 'desc')

    return view.render('forum/index', { posts })
}

// Menampilkan detail satu postingan beserta komentar-komentarnya
public async show({ params, view }: HttpContext) {
    const post = await Post.query()
    .where('id', params.id)
    .preload('user')
    .preload('forum_komentar', (query) => query.preload('user').orderBy('created_at', 'asc'))
    .firstOrFail()
    return view.render('forum/show', { post })
}

// Menampilkan form untuk membuat postingan baru
public async create({ view }: HttpContext) {
    return view.render('forum/create')
}

// Menyimpan postingan baru ke database
public async store({ request, response, session, auth }: HttpContext) {
    const { title, content } = request.only(['title', 'content'])

    if (!title || !content) {
    session.flash('error', 'Judul dan isi tidak boleh kosong.')
    return response.redirect().back()
    }

    // Gunakan user login jika ada, jika tidak, fallback ke userId 1
    const userId = auth.user ? auth.user.id : 1

    await Post.create({ title, content, userId })

    session.flash('success', 'Pengalaman berhasil dibagikan!')
    return response.redirect().toRoute('forum.index')
}

// Menyimpan komentar baru untuk sebuah postingan
public async storeComment({ request, response, params, session, auth }: HttpContext) {
    const postId = params.id
    const content = request.input('content')

    if (!content) {
    session.flash('error', 'Komentar tidak boleh kosong.')
    return response.redirect().back()
    }

    // Gunakan user login jika ada, jika tidak, fallback ke userId 1
    const userId = auth.user ? auth.user.id : 1

    await Comment.create({ postId, content, userId })

    session.flash('success', 'Komentar berhasil ditambahkan!')
    return response.redirect().toRoute('forum.show', { id: postId })
}

// API untuk data forum (JSON)
public async apiIndex({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 100 // atau sesuai kebutuhan, misal 100 agar semua data bisa diambil JS

    const posts = await Post.query()
        .preload('user')
        .preload('forum_komentar')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

    // Kembalikan hanya data array, atau seluruh objek paginate jika ingin pagination di frontend
    return response.json(posts)
}
}
