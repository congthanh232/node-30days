import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'grades'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('submission_id').unsigned().notNullable()
      table.integer('graded_by').unsigned().notNullable() // teacher nào chấm
      table.decimal('score', 5, 2).notNullable() // điểm thực tế
      table.text('feedback').nullable() // nhận xét của teacher

      // Foreign keys
      table.foreign('submission_id').references('id').inTable('submissions').onDelete('CASCADE')
      table.foreign('graded_by').references('id').inTable('users').onDelete('RESTRICT')

      // 1 submission chỉ có 1 grade (quan hệ 1-1)
      table.unique(['submission_id'])

      // Index
      table.index(['graded_by'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
