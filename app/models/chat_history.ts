import type { DateTime } from "luxon"
import { BaseModel, column } from "@adonisjs/lucid/orm"

export default class ChatHistory extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: string

  @column()
  declare user_message: string

  @column()
  declare bot_response: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
