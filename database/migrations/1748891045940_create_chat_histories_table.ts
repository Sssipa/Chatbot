import { BaseSchema } from "@adonisjs/lucid/schema"

export default class extends BaseSchema {
  protected tableName = "chat_histories"

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id")
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.text("user_message").notNullable()
      table.text("bot_response").notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
