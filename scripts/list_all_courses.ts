
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const courses = await prisma.course.findMany()
    courses.forEach(c => {
        console.log(`ID: ${c.id} | Lang: ${c.language} | Title: ${c.title}`)
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
