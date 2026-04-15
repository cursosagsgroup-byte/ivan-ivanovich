import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const courses = await prisma.course.findMany()
  console.log(courses)
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
