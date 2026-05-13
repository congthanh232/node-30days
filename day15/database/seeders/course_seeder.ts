import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Course from '#models/course'
import Assignment from '#models/assignment'

export default class CourseSeeder extends BaseSeeder {
  async run() {
    // Lấy danh sách instructors
    const instructors = await User.query().whereHas('roles', (q) => {
      q.where('name', 'instructor')
    })

    const topics = [
      'NodeJS',
      'AdonisJS',
      'React',
      'Vue',
      'TypeScript',
      'Python',
      'Django',
      'FastAPI',
      'Docker',
      'Kubernetes',
      'AWS',
      'PostgreSQL',
      'MongoDB',
      'Redis',
      'GraphQL',
      'NextJS',
      'NestJS',
      'Laravel',
      'Spring Boot',
      'Flutter',
    ]

    // Tạo 20 courses
    for (let i = 0; i < 20; i++) {
      const instructor = instructors[i % instructors.length] // chia đều cho instructors
      const topic = topics[i]

      const course = await Course.firstOrCreate(
        { title: `${topic} Fundamentals` },
        {
          teacherId: instructor.id,
          title: `${topic} Fundamentals`,
          description: `Learn ${topic} from scratch to advanced`,
          price: String((Math.floor(Math.random() * 10) + 1) * 10), // 10-100
          status: i % 3 === 0 ? 'draft' : 'published', // 1/3 draft, 2/3 published
        }
      )

      // Tạo 2 assignments cho mỗi course
      await Assignment.firstOrCreate(
        { courseId: course.id, title: 'Assignment 1' },
        {
          courseId: course.id,
          title: 'Assignment 1',
          description: 'First assignment',
          maxScore: 100,
        }
      )

      await Assignment.firstOrCreate(
        { courseId: course.id, title: 'Assignment 2' },
        {
          courseId: course.id,
          title: 'Assignment 2',
          description: 'Second assignment',
          maxScore: 50,
        }
      )
    }

    console.log(' 20 Courses + 40 Assignments seeded!')
  }
}
