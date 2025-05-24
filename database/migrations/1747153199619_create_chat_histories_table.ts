import { BaseSchema } from "@adonisjs/lucid/schema"

export default class extends BaseSchema {
  protected tableName = "chat_histories"

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id")
      table.string("user_id").notNullable()
      table.text("user_message").notNullable()
      table.text("bot_response").notNullable()

      table.timestamp("created_at")
      table.timestamp("updated_at")
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
