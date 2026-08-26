import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Admin Account
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hopenix.edu' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      name: 'System Admin',
      email: 'admin@hopenix.edu',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Admin user created/updated:', admin.email)

  // 2. Classes
  const classNames = [
    'Playgroup',
    'Nursery',
    'Prep',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
  ]

  const createdClasses = []
  for (let i = 0; i < classNames.length; i++) {
    const cls = await prisma.class.upsert({
      where: { name: classNames[i] },
      update: { displayOrder: i + 1 },
      create: { name: classNames[i], displayOrder: i + 1 },
    })
    createdClasses.push(cls)
  }
  console.log(`✅ ${createdClasses.length} classes initialized.`)

  // 3. Sections for each class
  const sectionNames = ['A', 'B', 'C']
  const createdSections = []
  for (const cls of createdClasses) {
    for (const secName of sectionNames) {
      const sec = await prisma.section.upsert({
        where: { classId_name: { classId: cls.id, name: secName } },
        update: {},
        create: { classId: cls.id, name: secName },
      })
      createdSections.push(sec)
    }
  }
  console.log(`✅ ${createdSections.length} class sections initialized.`)

  // 4. Subjects
  const subjectNames = [
    'Mathematics',
    'English',
    'Science',
    'Computer Science',
    'Urdu',
    'Islamiat',
    'Social Studies',
    'Physics',
    'Chemistry',
  ]

  const createdSubjects = []
  for (const subName of subjectNames) {
    const sub = await prisma.subject.upsert({
      where: { name: subName },
      update: {},
      create: { name: subName },
    })
    createdSubjects.push(sub)
  }
  console.log(`✅ ${createdSubjects.length} subjects initialized.`)

  // 5. Sample Teacher
  const teacherPasswordHash = await bcrypt.hash('Teacher@123', 10)
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@hopenix.edu' },
    update: {
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      status: 'ACTIVE',
    },
    create: {
      name: 'Muhammad Ali',
      email: 'teacher@hopenix.edu',
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      status: 'ACTIVE',
    },
  })

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: { phone: '+92 300 1234567' },
    create: {
      userId: teacherUser.id,
      employeeId: 'EMP-1001',
      phone: '+92 300 1234567',
    },
  })
  console.log('✅ Sample Teacher created:', teacherUser.email)

  // 6. Assign teacher to Grade 5 Section A Math & Grade 6 Section B Science
  const grade5 = createdClasses.find((c) => c.name === 'Grade 5')
  const grade6 = createdClasses.find((c) => c.name === 'Grade 6')
  const secA5 = createdSections.find((s) => s.classId === grade5.id && s.name === 'A')
  const secB6 = createdSections.find((s) => s.classId === grade6.id && s.name === 'B')

  const math = createdSubjects.find((s) => s.name === 'Mathematics')
  const science = createdSubjects.find((s) => s.name === 'Science')

  if (grade5 && secA5 && math) {
    await prisma.teacherAssignment.upsert({
      where: {
        teacherId_classId_sectionId_subjectId: {
          teacherId: teacher.id,
          classId: grade5.id,
          sectionId: secA5.id,
          subjectId: math.id,
        },
      },
      update: {},
      create: {
        teacherId: teacher.id,
        classId: grade5.id,
        sectionId: secA5.id,
        subjectId: math.id,
      },
    })
  }

  if (grade6 && secB6 && science) {
    await prisma.teacherAssignment.upsert({
      where: {
        teacherId_classId_sectionId_subjectId: {
          teacherId: teacher.id,
          classId: grade6.id,
          sectionId: secB6.id,
          subjectId: science.id,
        },
      },
      update: {},
      create: {
        teacherId: teacher.id,
        classId: grade6.id,
        sectionId: secB6.id,
        subjectId: science.id,
      },
    })
  }
  console.log('✅ Sample Teacher assignments configured.')

  // 7. Initial Diary Entry
  const todayISO = new Date().toISOString().split('T')[0]
  if (grade5 && secA5 && math) {
    await prisma.diary.create({
      data: {
        teacherId: teacher.id,
        classId: grade5.id,
        sectionId: secA5.id,
        subjectId: math.id,
        date: todayISO,
        homework: 'Complete Questions 1–10 from Exercise 4.2 in your geometry notebook.',
        diary: 'Please bring your geometry kit and ruler for tomorrow’s practical class.',
        notes: 'Chapter test scheduled for next Monday.',
      },
    })
    console.log('✅ Sample Daily Diary entry published.')
  }

  // 8. Sample Events
  const eventsCount = await prisma.event.count()
  if (eventsCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: 'Annual Sports Day 2026',
          description: 'Join us for an exciting day of athletic competition and sportsmanship across all grade levels.',
          eventDate: '2026-09-15',
          location: 'School Main Ground',
          published: true,
        },
        {
          title: 'Science & Robotics Exhibition',
          description: 'Students present innovative science projects and working robot prototypes.',
          eventDate: '2026-10-02',
          location: 'Auditorium',
          published: true,
        },
      ],
    })
    console.log('✅ Sample Events seeded.')
  }

  // 9. Initial Setting
  await prisma.setting.upsert({
    where: { id: 'school_settings' },
    update: {},
    create: {
      schoolName: 'Hopenix School System',
      contactEmail: 'info@hopenix.edu',
      contactPhone: '+92 42 111 222 333',
      address: 'Main Campus, Educational Complex, Lahore',
    },
  })

  console.log('✨ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
