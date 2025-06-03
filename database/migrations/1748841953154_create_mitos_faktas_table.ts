import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mitos_faktas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('mitos').notNullable()
      table.string('fakta').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}