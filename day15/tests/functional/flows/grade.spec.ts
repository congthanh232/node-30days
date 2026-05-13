import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Assignment from '#models/assignment'
import Submission from '#models/submission'

test.group('Flow: Grade', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('instructor có thể chấm điểm submission', async ({ client, assert }) => {
    const ts = Date.now()

    // 1. Tạo instructor + course + assignment
    const instructorRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Instructor',
      email: `instructor_${ts}@test.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'instructor',
    } as any)
    const instructorToken = (instructorRes.body() as any).data.token

    const courseRes = await client
      .post('/api/v1/courses')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({ title: 'Test Course', price: 49.99, status: 'published' })
    const courseId = (courseRes.body() as any).data.course.id

    const assignment = await Assignment.create({
      courseId,
      title: 'Test Assignment',
      maxScore: 100,
    })

    // 2. Tạo student + enroll + nộp bài
    await client.post('/api/v1/auth/register').json({
      fullName: 'Test Student',
      email: `student_${ts}@test.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'student',
    } as any)
    const loginRes = await client.post('/api/v1/auth/login').json({
      email: `student_${ts}@test.com`,
      password: 'password123',
    })
    const studentToken = (loginRes.body() as any).data.token

    await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({ courseId } as any)

    const submitRes = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({ assignment_id: assignment.id, content: 'Bài làm của tôi' })
    const submissionId = (submitRes.body() as any).data.submission.id

    // 3. Instructor chấm điểm
    const gradeRes = await client
      .post('/api/v1/grades')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({
        submissionId,
        score: 85,
        feedback: 'Bài làm tốt!',
      })
    gradeRes.assertStatus(200)

    // 4. Assert response
    const grade = (gradeRes.body() as any).data.grade
    assert.equal(grade.submissionId, submissionId)
    assert.equal(grade.score, '85')
    assert.equal(grade.feedback, 'Bài làm tốt!')
  })

  test('không thể chấm 1 submission 2 lần', async ({ client, assert }) => {
    const ts = Date.now()

    const instructorRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Instructor',
      email: `instructor2_${ts}@test.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'instructor',
    } as any)
    const instructorToken = (instructorRes.body() as any).data.token

    const courseRes = await client
      .post('/api/v1/courses')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({ title: 'Test Course 2', price: 49.99, status: 'published' })
    const courseId = (courseRes.body() as any).data.course.id

    const assignment = await Assignment.create({ courseId, title: 'Assignment 2', maxScore: 100 })

    await client.post('/api/v1/auth/register').json({
      fullName: 'Test Student',
      email: `student2_${ts}@test.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'student',
    } as any)
    const loginRes = await client.post('/api/v1/auth/login').json({
      email: `student2_${ts}@test.com`,
      password: 'password123',
    })
    const studentToken = (loginRes.body() as any).data.token

    await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({ courseId } as any)

    const submitRes = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({ assignment_id: assignment.id, content: 'Bài làm' })
    const submissionId = (submitRes.body() as any).data.submission.id

    // Chấm lần 1
    await client
      .post('/api/v1/grades')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({ submissionId, score: 90, feedback: 'Tốt!' })

    // Chấm lần 2 → phải báo already graded
    const secondGrade = await client
      .post('/api/v1/grades')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({ submissionId, score: 50, feedback: 'Thử lại' })
    secondGrade.assertStatus(200)
    assert.equal(
      (secondGrade.body() as any).data.message,
      'This submission has already been graded'
    )
  })

  test('student không thể chấm điểm', async ({ client }) => {
    const ts = Date.now()

    // Tạo submission trực tiếp trong DB
    const submission = await Submission.create({
      userId: 1,
      assignmentId: 1,
      content: 'test',
      status: 'draft',
    })

    await client.post('/api/v1/auth/register').json({
      fullName: 'Test Student',
      email: `student3_${ts}@test.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'student',
    } as any)
    const loginRes = await client.post('/api/v1/auth/login').json({
      email: `student3_${ts}@test.com`,
      password: 'password123',
    })
    const studentToken = (loginRes.body() as any).data.token

    // Student chấm điểm → phải bị 403
    const gradeRes = await client
      .post('/api/v1/grades')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({ submissionId: submission.id, score: 100 })
    gradeRes.assertStatus(403)
  })
})
