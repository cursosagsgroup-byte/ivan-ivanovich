import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Buscando un usuario de prueba con inscripciones...\n');

    // Buscar un estudiante con inscripciones y progreso
    const student = await prisma.user.findFirst({
        where: {
            role: 'STUDENT',
            enrollments: {
                some: {
                    progress: {
                        gt: 0
                    }
                }
            }
        },
        include: {
            enrollments: {
                include: {
                    course: true
                }
            },
            quizAttempts: {
                take: 5,
                orderBy: {
                    attemptedAt: 'desc'
                }
            }
        }
    });

    if (!student) {
        console.log('❌ No se encontró ningún estudiante con progreso');
        return;
    }

    console.log('✅ Usuario encontrado:\n');
    console.log(`📧 Email: ${student.email}`);
    console.log(`👤 Nombre: ${student.name}`);
    console.log(`📚 Inscripciones: ${student.enrollments.length}`);
    console.log(`📝 Intentos de quiz: ${student.quizAttempts.length}`);

    console.log('\n📚 Cursos inscritos:');
    for (const enrollment of student.enrollments) {
        console.log(`   - ${enrollment.course.title} (Progreso: ${enrollment.progress}%)`);
    }

    // Actualizar contraseña a algo simple para pruebas
    const newPassword = 'test123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: student.id },
        data: { password: hashedPassword }
    });

    console.log('\n🔑 Contraseña actualizada para pruebas:');
    console.log(`   Email: ${student.email}`);
    console.log(`   Password: ${newPassword}`);
    console.log('\n✅ Puedes usar estas credenciales para iniciar sesión!');
}

main()
    .catch((e) => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
