import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('assignment_id').unsigned().notNullable()
      table.text('content').nullable() // bài làm dạng text
      table.string('file_url').nullable() // hoặc nộp file
      table.enum('status', ['draft', 'submitted', 'graded']).defaultTo('draft')
      table.timestamp('submitted_at').nullable() // thời điểm thực sự nộp

      // Foreign keys
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('assignment_id').references('id').inTable('assignments').onDelete('CASCADE')

      // 1 user chỉ có 1 submission cho 1 assignment
      table.unique(['user_id', 'assignment_id'])

      // Index
      table.index(['user_id'])
      table.index(['assignment_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
