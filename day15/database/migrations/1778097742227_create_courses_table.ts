import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'courses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('teacher_id').unsigned().notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.enum('status', ['draft', 'published', 'archived']).defaultTo('draft')
      table.decimal('price', 10, 2).defaultTo(0)

      // Foreign key
      table.foreign('teacher_id').references('id').inTable('users').onDelete('RESTRICT')

      // Index — tìm course theo teacher thường xuyên
      table.index(['teacher_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
