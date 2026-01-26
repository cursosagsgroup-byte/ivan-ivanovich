import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Buscando cursos al 100% sin fecha de completado...\n");

    // Buscar todas las inscripciones con progreso 100% pero SIN completedAt
    const incompleteCourses = await prisma.enrollment.findMany({
        where: {
            progress: 100,
            completedAt: null
        },
        include: {
            user: true,
            course: true
        }
    });

    console.log(`📊 Encontrados ${incompleteCourses.length} cursos al 100% sin completedAt\n`);

    if (incompleteCourses.length === 0) {
        console.log("✅ Todos los cursos al 100% tienen completedAt marcado.");
        return;
    }

    let updatedCount = 0;
    let certCreatedCount = 0;

    for (const enrollment of incompleteCourses) {
        console.log(`⚠️  ${enrollment.user.name} - ${enrollment.course.title}`);
        console.log(`   Progress: ${enrollment.progress}%`);
        console.log(`   Enrolled: ${enrollment.enrolledAt}`);
        console.log(`   CompletedAt: ${enrollment.completedAt}`);

        // Actualizar completedAt con la fecha actual
        const now = new Date();
        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { completedAt: now }
        });

        console.log(`   ✅ Actualizado completedAt: ${now}`);
        updatedCount++;

        // Verificar si ya existe un certificado
        const existingCert = await prisma.certificate.findFirst({
            where: {
                userId: enrollment.userId,
                courseId: enrollment.courseId
            }
        });

        if (!existingCert) {
            // Crear certificado
            const newCert = await prisma.certificate.create({
                data: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    issuedAt: now,
                    certificateUrl: `/api/certificate/placeholder`
                }
            });

            // Actualizar URL con el ID real
            await prisma.certificate.update({
                where: { id: newCert.id },
                data: {
                    certificateUrl: `/api/certificate/${newCert.id}`
                }
            });

            console.log(`   🎓 Certificado creado: ${newCert.id}\n`);
            certCreatedCount++;
        } else {
            console.log(`   ℹ️  Ya tiene certificado: ${existingCert.id}\n`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📈 RESUMEN:`);
    console.log(`   ✅ Enrollments actualizados: ${updatedCount}`);
    console.log(`   🎓 Certificados creados: ${certCreatedCount}`);
    console.log(`   📊 Total procesados: ${incompleteCourses.length}`);
    console.log("=".repeat(60));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
