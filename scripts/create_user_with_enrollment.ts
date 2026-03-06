import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'urigape2903@hotmail.com';
    const rawPassword = 'IvanPE2024!';
    const courseName = 'Team Leader en Protección Ejecutiva';

    console.log(`\n=== Creando usuario: ${email} ===\n`);

    // 1. Buscar si ya existe el usuario
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log(`⚠️  El usuario ya existe con ID: ${existing.id}`);
        console.log(`   Procediendo solo con el enrollment...`);
    }

    // 2. Crear el usuario si no existe
    let user = existing;
    if (!user) {
        const hashedPassword = await bcrypt.hash(rawPassword, 12);
        user = await prisma.user.create({
            data: {
                email,
                name: 'urigape2903',
                password: hashedPassword,
                role: 'STUDENT',
            }
        });
        console.log(`✅ Usuario creado con ID: ${user.id}`);
    }

    // 3. Buscar el curso por nombre (búsqueda parcial)
    const course = await prisma.course.findFirst({
        where: {
            title: {
                contains: courseName,
                mode: 'insensitive',
            }
        },
        select: { id: true, title: true }
    });

    if (!course) {
        console.error(`❌ Curso no encontrado con el título: "${courseName}"`);
        console.log('\nBuscando cursos disponibles:');
        const allCourses = await prisma.course.findMany({ select: { id: true, title: true } });
        allCourses.forEach(c => console.log(`  - ${c.title}`));
        return;
    }

    console.log(`✅ Curso encontrado: "${course.title}" (ID: ${course.id})`);

    // 4. Verificar si ya tiene enrollment
    const existingEnrollment = await prisma.enrollment.findFirst({
        where: { userId: user.id, courseId: course.id }
    });

    if (existingEnrollment) {
        console.log(`⚠️  El usuario ya está inscrito en este curso.`);
        console.log(`   Enrollment ID: ${existingEnrollment.id}`);
    } else {
        // 5. Crear enrollment
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: user.id,
                courseId: course.id,
                progress: 0,
            }
        });
        console.log(`✅ Enrollment creado con ID: ${enrollment.id}`);
    }

    console.log('\n=============================');
    console.log(`📧 Email:      ${email}`);
    console.log(`🔑 Contraseña: ${rawPassword}`);
    console.log(`📚 Curso:      ${course.title}`);
    console.log('=============================\n');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
