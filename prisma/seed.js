import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hopenix.edu.pk' },
    update: {
      name: 'System Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
    create: {
      name: 'System Admin',
      email: 'admin@hopenix.edu.pk',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })
  console.log('✅ Admin user created/verified:', admin.email)

  // 2. Seed Classes & Sections
  const classesData = [
    { name: 'Playgroup', order: 1 },
    { name: 'Nursery', order: 2 },
    { name: 'Prep', order: 3 },
    { name: 'Grade 1', order: 4 },
    { name: 'Grade 2', order: 5 },
    { name: 'Grade 3', order: 6 },
    { name: 'Grade 4', order: 7 },
    { name: 'Grade 5', order: 8 },
    { name: 'Grade 6', order: 9 },
    { name: 'Grade 7', order: 10 },
    { name: 'Grade 8', order: 11 },
    { name: 'Grade 9', order: 12 },
    { name: 'Grade 10', order: 13 },
  ]

  const sectionsList = ['A', 'B', 'C', 'D']

  const createdClasses = []
  for (const c of classesData) {
    const cls = await prisma.class.upsert({
      where: { name: c.name },
      update: { displayOrder: c.order },
      create: { name: c.name, displayOrder: c.order },
    })
    createdClasses.push(cls)

    // Add sections
    for (const secName of sectionsList) {
      await prisma.section.upsert({
        where: {
          classId_name: {
            classId: cls.id,
            name: secName,
          },
        },
        update: {},
        create: {
          classId: cls.id,
          name: secName,
        },
      })
    }
  }
  console.log(`✅ ${createdClasses.length} Classes and Sections created/verified`)

  // 3. Seed Subjects
  const subjectsList = [
    'Mathematics',
    'English',
    'Science',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Urdu',
    'Islamiat',
    'Social Studies',
  ]

  const createdSubjects = []
  for (const subName of subjectsList) {
    const sub = await prisma.subject.upsert({
      where: { name: subName },
      update: {},
      create: { name: subName },
    })
    createdSubjects.push(sub)
  }
  console.log(`✅ ${createdSubjects.length} Subjects created/verified`)

  // 4. Seed Teacher Account
  const teacherPasswordHash = await bcrypt.hash('Teacher@123456', 10)
  const teacherUser = await prisma.user.upsert({
    where: { email: 'ahmed@hopenix.edu.pk' },
    update: {
      name: 'Mr. Muhammad Ali',
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      status: 'ACTIVE',
    },
    create: {
      name: 'Mr. Muhammad Ali',
      email: 'ahmed@hopenix.edu.pk',
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      status: 'ACTIVE',
    },
  })

  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {
      employeeId: 'EMP-1001',
      phone: '+92 300 1234567',
    },
    create: {
      userId: teacherUser.id,
      employeeId: 'EMP-1001',
      phone: '+92 300 1234567',
    },
  })
  console.log('✅ Teacher created/verified:', teacherUser.email)

  // 5. Assign Teacher to Grade 5 Section A - Mathematics & Grade 6 Section B - Mathematics
  const grade5 = createdClasses.find((c) => c.name === 'Grade 5')
  const grade6 = createdClasses.find((c) => c.name === 'Grade 6')
  const mathSub = createdSubjects.find((s) => s.name === 'Mathematics')

  if (grade5 && grade6 && mathSub) {
    const secA = await prisma.section.findUnique({
      where: { classId_name: { classId: grade5.id, name: 'A' } },
    })
    const secB = await prisma.section.findUnique({
      where: { classId_name: { classId: grade6.id, name: 'B' } },
    })

    if (secA) {
      await prisma.teacherAssignment.upsert({
        where: {
          teacherId_classId_sectionId_subjectId: {
            teacherId: teacher.id,
            classId: grade5.id,
            sectionId: secA.id,
            subjectId: mathSub.id,
          },
        },
        update: {},
        create: {
          teacherId: teacher.id,
          classId: grade5.id,
          sectionId: secA.id,
          subjectId: mathSub.id,
        },
      })
    }

    if (secB) {
      await prisma.teacherAssignment.upsert({
        where: {
          teacherId_classId_sectionId_subjectId: {
            teacherId: teacher.id,
            classId: grade6.id,
            sectionId: secB.id,
            subjectId: mathSub.id,
          },
        },
        update: {},
        create: {
          teacherId: teacher.id,
          classId: grade6.id,
          sectionId: secB.id,
          subjectId: mathSub.id,
        },
      })
    }
  }

  // 6. Sample Daily Diary Entry
  const todayStr = new Date().toISOString().split('T')[0]
  if (grade5 && mathSub) {
    const secA = await prisma.section.findUnique({
      where: { classId_name: { classId: grade5.id, name: 'A' } },
    })
    if (secA) {
      await prisma.diary.create({
        data: {
          teacherId: teacher.id,
          classId: grade5.id,
          sectionId: secA.id,
          subjectId: mathSub.id,
          date: todayStr,
          homework: 'Complete questions 1 to 10 from Exercise 4.',
          diary: 'Bring your mathematics notebook and geometry box tomorrow.',
          notes: 'Test on Chapter 3 scheduled for Friday.',
        },
      })
      console.log('✅ Sample Daily Diary entry created')
    }
  }

  // 7. Seed Sample Events
  const existingEventsCount = await prisma.event.count()
  if (existingEventsCount === 0) {
    await prisma.event.createMany({
      data: [
        {
          title: 'Annual Sports Day 2026',
          description: 'Join us for our annual inter-house athletics and sports competition.',
          eventDate: '2026-10-15',
          location: 'Hopenix School Sports Complex',
          imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
          published: true,
        },
        {
          title: 'Science & Robotics Exhibition',
          description: 'Students present creative STEM projects, robotics models, and scientific experiments.',
          eventDate: '2026-11-20',
          location: 'Main Auditorium',
          imageUrl: 'https://images.unsplash.com/photo-1564069114553-74154c4232d6?w=800&auto=format&fit=crop&q=80',
          published: true,
        },
      ],
    })
    console.log('✅ Sample Events created')
  }

  // 8. Seed Sample Admission
  const existingAdmissionsCount = await prisma.admission.count()
  if (existingAdmissionsCount === 0) {
    await prisma.admission.create({
      data: {
        studentName: 'Zainab Fatima',
        parentName: 'Tariq Mehmood',
        phone: '+92 321 9876543',
        email: 'tariq.mehmood@example.com',
        classApplyingFor: 'Grade 5',
        message: 'Looking for admission for the academic year 2026-2027.',
        status: 'PENDING',
      },
    })
    console.log('✅ Sample Admission application created')
  }

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
