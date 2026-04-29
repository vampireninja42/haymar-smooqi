import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface Slide {
  slideOrder: number
  slideType?: string
  title?: string
  content?: string
  imageUrl?: string
}

interface QuizQuestion {
  question: string
  optionA?: string
  otionA?: string   // typo in source data
  optionB?: string
  otionB?: string
  optionC?: string
  otionC?: string   // typo in source data
  optionD?: string
  otionD?: string   // typo in source data
  correctAnswer: string
  explanation?: string
}

interface LessonData {
  slug: string
  title: string
  sortOrder?: number
  estimatedMinutes?: number
  slides?: Slide[]
  quizQuestions?: QuizQuestion[]
}

interface CourseFile {
  courseSlug: string
  lessons: LessonData[]
}

function getOption(q: QuizQuestion, letter: 'A' | 'B' | 'C' | 'D'): string {
  // Handle both correct spelling and typo variants
  const key = `option${letter}` as keyof QuizQuestion
  const typoKey = `otion${letter}` as keyof QuizQuestion
  return (q[key] ?? q[typoKey] ?? '') as string
}

async function main() {
  const contentDir = path.join(process.cwd(), 'content', 'courses')
  const courseDirs = fs.readdirSync(contentDir).filter(d =>
    fs.statSync(path.join(contentDir, d)).isDirectory()
  )

  let totalLessons = 0
  let totalSlides = 0
  let totalQuiz = 0
  let skipped = 0

  for (const dirName of courseDirs) {
    const filePath = path.join(contentDir, dirName, 'lessons.json')
    if (!fs.existsSync(filePath)) continue

    const raw: CourseFile = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const courseSlug = raw.courseSlug ?? dirName

    const course = await prisma.course.findUnique({ where: { slug: courseSlug } })
    if (!course) {
      console.log(`  ⚠ Skipping ${courseSlug} — not found in DB`)
      skipped++
      continue
    }

    let lessonCount = 0
    let slideCount = 0
    let quizCount = 0

    for (const [i, lesson] of raw.lessons.entries()) {
      // Find or create lesson by slug
      let dbLesson = await prisma.lesson.findFirst({ where: { slug: lesson.slug } })
      if (dbLesson) {
        dbLesson = await prisma.lesson.update({
          where: { id: dbLesson.id },
          data: {
            title: lesson.title,
            sortOrder: lesson.sortOrder ?? i + 1,
            estimatedMinutes: lesson.estimatedMinutes ?? 5,
            courseId: course.id,
          },
        })
      } else {
        dbLesson = await prisma.lesson.create({
          data: {
            slug: lesson.slug,
            title: lesson.title,
            sortOrder: lesson.sortOrder ?? i + 1,
            estimatedMinutes: lesson.estimatedMinutes ?? 5,
            courseId: course.id,
          },
        })
      }
      lessonCount++

      // Replace slides: delete existing, insert fresh
      if (lesson.slides?.length) {
        await prisma.slide.deleteMany({ where: { lessonId: dbLesson.id } })
        await prisma.slide.createMany({
          data: lesson.slides.map(s => ({
            lessonId: dbLesson.id,
            slideOrder: s.slideOrder,
            slideType: s.slideType ?? 'lesson',
            title: s.title ?? null,
            content: s.content ?? '',
            imageUrl: s.imageUrl ?? null,
          })),
        })
        slideCount += lesson.slides.length
      }

      // Replace quiz questions: delete existing, insert fresh
      if (lesson.quizQuestions?.length) {
        // Delete DailyChallenges referencing these questions first (FK constraint)
        const existingQIds = await prisma.quizQuestion.findMany({
          where: { lessonId: dbLesson.id },
          select: { id: true },
        })
        if (existingQIds.length) {
          const ids = existingQIds.map((q: { id: string }) => q.id)
          await prisma.userDailyChallenge.deleteMany({ where: { challenge: { questionId: { in: ids } } } })
          await prisma.dailyChallenge.deleteMany({ where: { questionId: { in: ids } } })
        }
        await prisma.quizQuestion.deleteMany({ where: { lessonId: dbLesson.id } })
        await prisma.quizQuestion.createMany({
          data: lesson.quizQuestions.map((q, qi) => ({
            lessonId: dbLesson.id,
            sortOrder: qi + 1,
            type: 'multiple_choice',
            question: q.question,
            optionA: getOption(q, 'A'),
            optionB: getOption(q, 'B'),
            optionC: getOption(q, 'C'),
            optionD: getOption(q, 'D'),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation ?? null,
          })),
        })
        quizCount += lesson.quizQuestions.length
      }
    }

    console.log(`  ✓ ${courseSlug}: ${lessonCount} lessons, ${slideCount} slides, ${quizCount} quiz questions`)
    totalLessons += lessonCount
    totalSlides += slideCount
    totalQuiz += quizCount
  }

  console.log(`\nDone. ${totalLessons} lessons, ${totalSlides} slides, ${totalQuiz} quiz questions imported. ${skipped} skipped.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
