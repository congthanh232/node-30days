import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'enrollments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('course_id').unsigned().notNullable()
      table.enum('status', ['active', 'completed', 'cancelled']).defaultTo('active')
      table.decimal('paid_price', 10, 2).defaultTo(0) // giá tại thời điểm mua
      table.timestamp('completed_at').nullable() // khi nào hoàn thành

      // Foreign keys
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')

      // 1 user chỉ enroll 1 course 1 lần
      table.unique(['user_id', 'course_id'])

      // Index — thường query "tất cả course của user X"
      table.index(['user_id'])
      table.index(['course_id'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
