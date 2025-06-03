import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class MitosFakta extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare mitos: string

  @column()
  declare fakta: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}