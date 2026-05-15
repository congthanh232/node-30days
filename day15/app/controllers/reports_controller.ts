import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Course from '#models/course'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class ReportsController {
  /**
   * Điểm trung bình theo course — chỉ instructor sở hữu course
   */
  async courseStats({ params, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    const course = await Course.query()
      .where('id', params.course_id)
      .where('teacher_id', user.id) // chỉ instructor sở hữu mới xem được
      .firstOrFail()

    const stats = await db.rawQuery(
      `
      SELECT
        COUNT(DISTINCT e.id) as total_students,
        COUNT(DISTINCT s.id) as total_submissions,
        COUNT(DISTINCT g.id) as total_graded,
        ROUND(AVG(g.score), 2) as average_score,
        MAX(g.score) as highest_score,
        MIN(g.score) as lowest_score
      FROM enrollments e
      LEFT JOIN assignments a ON a.course_id = e.course_id
      LEFT JOIN submissions s ON s.assignment_id = a.id AND s.user_id = e.user_id
      LEFT JOIN grades g ON g.submission_id = s.id
      WHERE e.course_id = ?
    `,
      [course.id]
    )

    return serialize({
      course: {
        id: course.id,
        title: course.title,
      },
      stats: stats[0][0],
    })
  }

  /**
   * Top 10 students theo điểm trung bình
   */
  async topStudents({ params, auth, serialize }: HttpContext) {
    const user = auth.getUserOrFail()

    // Kiểm tra instructor sở hữu course
    const course = await Course.query()
      .where('id', params.course_id)
      .where('teacher_id', user.id)
      .firstOrFail()

    const topStudents = await db.rawQuery(
      `
      SELECT
        u.id,
        u.full_name,
        u.email,
        COUNT(g.id) as total_graded,
        ROUND(AVG(g.score), 2) as average_score,
        MAX(g.score) as highest_score
      FROM users u
      JOIN enrollments e ON e.user_id = u.id AND e.course_id = ?
      LEFT JOIN submissions s ON s.user_id = u.id
      LEFT JOIN grades g ON g.submission_id = s.id
      GROUP BY u.id, u.full_name, u.email
      ORDER BY average_score DESC
      LIMIT 10
    `,
      [course.id]
    )

    return serialize({
      course: {
        id: course.id,
        title: course.title,
      },
      topStudents: topStudents[0],
    })
  }
}
