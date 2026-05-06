import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'lessons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('course_id').unsigned().notNullable()
      table.string('title').notNullable()
      table.text('content').nullable()
      table.string('video_url').nullable()
      table.integer('order').unsigned().notNullable().defaultTo(0) // thứ tự bài học
      table.boolean('is_free').defaultTo(false) // bài học miễn phí hay không

      // Foreign key
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')

      // Index — thường query "lấy tất cả lessons của course X theo thứ tự"
      table.index(['course_id', 'order'])

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
