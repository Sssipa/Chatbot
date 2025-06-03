import type { HttpContext } from "@adonisjs/core/http"
import Artikel from "#models/artikel"

export default class ArtikelsController {
    public async index({ response }: HttpContext) {
        const artikels = await Artikel.query().orderBy('created_at', 'desc')
        return response.json(artikels)
    }

    public async show({ params, view }: HttpContext) {
        const artikel = await Artikel.findOrFail(params.id)
        return view.render('artikel/show', { artikel })
    }
}