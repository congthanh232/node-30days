import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Assignment from '#models/assignment'

test.group('Flow: Submit', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())
  const ts = Date.now()

  test('student đã enrolled có thể nộp bài', async ({ client, assert }) => {
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

    // Tạo assignment trực tiếp trong DB
    const assignment = await Assignment.create({
      courseId,
      title: 'Test Assignment',
      maxScore: 100,
    })

    // 2. Register + login student
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

    // 3. Enroll course
    await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({ courseId } as any)

    // 4. Nộp bài
    const submitRes = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({
        assignment_id: assignment.id,
        content: 'Bài làm của tôi',
      })
    submitRes.assertStatus(200)

    // 5. Assert response
    const submission = (submitRes.body() as any).data.submission
    assert.equal(submission.assignmentId, assignment.id)
    assert.equal(submission.status, 'draft')
    assert.equal(submission.content, 'Bài làm của tôi')
  })

  test('student chưa enrolled không thể nộp bài', async ({ client }) => {
    // Tạo instructor + course + assignment
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

    const assignment = await Assignment.create({
      courseId,
      title: 'Test Assignment 2',
      maxScore: 100,
    })

    // Register student nhưng KHÔNG enroll
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

    // Nộp bài mà chưa enrolled → phải lỗi 500
    const submitRes = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${studentToken}`)
      .json({
        assignment_id: assignment.id,
        content: 'Bài làm của tôi',
      })
    submitRes.assertStatus(500)
  })

  test('instructor không thể nộp bài', async ({ client }) => {
    // Tạo instructor
    const instructorRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Instructor',
      email: `instructor3_${ts}@test.com`,
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'instructor',
    } as any)
    const instructorToken = (instructorRes.body() as any).data.token

    const courseRes = await client
      .post('/api/v1/courses')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({ title: 'Test Course 3', price: 49.99, status: 'published' })
    const courseId = (courseRes.body() as any).data.course.id

    const assignment = await Assignment.create({
      courseId,
      title: 'Test Assignment 3',
      maxScore: 100,
    })

    // Instructor nộp bài → phải bị 403
    const submitRes = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({
        assignment_id: assignment.id,
        content: 'Instructor không được nộp bài',
      })
    submitRes.assertStatus(403)
  })
})
