import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const result = await prisma.course.create({
    data: {
      title: 'Curso de Contravigilancia en Protección Ejecutiva',
      description: 'Aprende las técnicas más avanzadas para detectar y neutralizar la vigilancia hostil. Capacitación presencial intensiva.',
      price: 14800,
      image: '/curso-contravigilancia.jpg',
      language: 'es',
      published: true,
    }
  })
  console.log('Created:', result)
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
