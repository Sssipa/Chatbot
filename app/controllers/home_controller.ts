import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'

export default class HomeController {
    public async index({ view }: HttpContext) {
        const comments = await Comment.query().orderBy('created_at', 'desc').limit(4)
        return view.render('home', { comments })
    }
}