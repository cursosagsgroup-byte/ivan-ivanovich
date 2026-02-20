import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const TARGET_EMAIL = "notificacionesluis@outlook.com"
const TARGET_PASSWORD = "password123" // Temporary password, user should change it

async function recreateUser() {
    console.log(`Starting recreation process for: ${TARGET_EMAIL}`)

    // 1. Fetch existing user and all related data
    const existingUser = await prisma.user.findUnique({
        where: { email: TARGET_EMAIL },
        include: {
            enrollments: true,
            lessonProgress: true,
            quizAttempts: true,
            certificates: true,
            orders: true,
            cart: {
                include: {
                    items: true
                }
            }
        }
    })

    if (!existingUser) {
        console.error("User not found! Cannot backup.")
        return
    }

    console.log("BACKUP DATA:")
    console.log(JSON.stringify(existingUser, null, 2))

    // 2. Prepare data for restoration
    const userData = {
        name: existingUser.name,
        email: existingUser.email,
        image: existingUser.image,
        role: existingUser.role,
        country: existingUser.country,
        phone: existingUser.phone,
        age: existingUser.age,
        language: existingUser.language,
        // We will set a NEW known password because we can't extract the old hash reliably if salt changed
        password: await bcrypt.hash(TARGET_PASSWORD, 10),
        emailVerified: new Date(), // verified now
    }

    const enrollmentsToRestore = existingUser.enrollments.map(e => ({
        courseId: e.courseId,
        progress: e.progress,
        completedAt: e.completedAt,
        enrolledAt: e.enrolledAt
    }))

    const progressToRestore = existingUser.lessonProgress.map(p => ({
        lessonId: p.lessonId,
        completed: p.completed,
        completedAt: p.completedAt
    }))

    const attemptsToRestore = existingUser.quizAttempts.map(a => ({
        quizId: a.quizId,
        score: a.score,
        passed: a.passed,
        answers: a.answers,
        attemptedAt: a.attemptedAt
    }))

    const certificatesToRestore = existingUser.certificates.map(c => ({
        courseId: c.courseId,
        certificateUrl: c.certificateUrl,
        issuedAt: c.issuedAt
    }))

    // 3. Delete existing user (Cascade will delete relations)
    console.log("Deleting existing user...")
    await prisma.user.delete({
        where: { email: TARGET_EMAIL }
    })
    console.log("User deleted.")

    // 4. Create new user
    console.log("Creating new user...")
    const newUser = await prisma.user.create({
        data: userData
    })
    console.log(`New user created with ID: ${newUser.id}`)

    // 5. Restore Enrollments
    if (enrollmentsToRestore.length > 0) {
        console.log(`Restoring ${enrollmentsToRestore.length} enrollments...`)
        await prisma.enrollment.createMany({
            data: enrollmentsToRestore.map(e => ({ ...e, userId: newUser.id }))
        })
    }

    // 6. Restore Lesson Progress
    if (progressToRestore.length > 0) {
        console.log(`Restoring ${progressToRestore.length} lesson progress records...`)
        await prisma.lessonProgress.createMany({
            data: progressToRestore.map(p => ({ ...p, userId: newUser.id }))
        })
    }

    // 7. Restore Quiz Attempts
    if (attemptsToRestore.length > 0) {
        console.log(`Restoring ${attemptsToRestore.length} quiz attempts...`)
        await prisma.quizAttempt.createMany({
            data: attemptsToRestore.map(a => ({ ...a, userId: newUser.id }))
        })
    }

    // 8. Restore Certificates
    if (certificatesToRestore.length > 0) {
        console.log(`Restoring ${certificatesToRestore.length} certificates...`)
        await prisma.certificate.createMany({
            data: certificatesToRestore.map(c => ({ ...c, userId: newUser.id }))
        })
    }

    console.log("Recreation complete successfully.")
    console.log(`New Password for user: ${TARGET_PASSWORD}`)
}

recreateUser()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
