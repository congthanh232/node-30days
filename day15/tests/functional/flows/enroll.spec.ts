import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Flow: Enroll', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('student có thể enroll course thành công', async ({ client, assert }) => {
    // 1. Register student
    const registerRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Student',
      email: 'teststudent@test.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'student',
    } as any)
    registerRes.assertStatus(200)

    // 2. Login → lấy token
    const loginRes = await client.post('/api/v1/auth/login').json({
      email: 'teststudent@test.com',
      password: 'password123',
    })
    loginRes.assertStatus(200)
    const token = (loginRes.body() as any).data.token

    // 3. Register instructor + tạo course
    const instructorRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Instructor',
      email: 'testinstructor@test.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'instructor',
    } as any)
    const instructorToken = (instructorRes.body() as any).data.token

    const courseRes = await client
      .post('/api/v1/courses')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({
        title: 'Test Course',
        description: 'Test Description',
        price: 99.99,
        status: 'published',
      })
    courseRes.assertStatus(200)
    const courseId = (courseRes.body() as any).data.course.id

    // 4. Enroll course
    const enrollRes = await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${token}`)
      .json({ courseId } as any)
    enrollRes.assertStatus(200)

    // 5. Assert response
    const enrollment = (enrollRes.body() as any).data.enrollment
    assert.equal(enrollment.courseId, courseId)
    assert.equal(enrollment.status, 'active')
  })

  test('student không thể enroll course 2 lần', async ({ client, assert }) => {
    await client.post('/api/v1/auth/register').json({
      fullName: 'Test Student',
      email: 'teststudent2@test.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      role: 'student',
    } as any)
    const loginRes = await client.post('/api/v1/auth/login').json({
      email: 'teststudent2@test.com',
      password: 'password123',
    })
    const token = (loginRes.body() as any).data.token

    const instructorRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Instructor',
      email: 'testinstructor2@test.com',
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

    // Enroll lần 1
    await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${token}`)
      .json({ courseId } as any)

    // Enroll lần 2 → phải báo already enrolled
    const secondEnroll = await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${token}`)
      .json({ courseId } as any)
    secondEnroll.assertStatus(200)
    assert.equal((secondEnroll.body() as any).data.message, 'Already enrolled in this course')
  })

  test('instructor không thể enroll course', async ({ client }) => {
    const instructorRes = await client.post('/api/v1/auth/register').json({
      fullName: 'Test Instructor',
      email: 'testinstructor3@test.com',
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

    const enrollRes = await client
      .post('/api/v1/enrollments')
      .header('Authorization', `Bearer ${instructorToken}`)
      .json({ courseId } as any)
    enrollRes.assertStatus(403)
  })
})
