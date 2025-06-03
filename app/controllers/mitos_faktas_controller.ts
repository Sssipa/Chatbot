import type { HttpContext } from "@adonisjs/core/http"
import MitosFakta from "#models/mitos_fakta"

export default class MitosFaktasController {
    public async index({ response }: HttpContext) {
        const data = await MitosFakta.all()
        return response.json(data)
    }
}