import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'assignments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('course_id').unsigned().notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.integer('max_score').unsigned().notNullable().defaultTo(100)
      table.timestamp('due_date').nullable() // hạn nộp bài

      // Foreign key
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')

      // Index — thường query "tất cả assignments của course X"
      table.index(['course_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
