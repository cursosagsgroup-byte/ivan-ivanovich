import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔍 Buscando cursos completados sin certificados...\n");

    // Buscar todas las inscripciones con progreso 100% y completedAt no nulo
    const completedEnrollments = await prisma.enrollment.findMany({
        where: {
            progress: 100,
            completedAt: {
                not: null
            }
        },
        include: {
            user: true,
            course: true
        }
    });

    console.log(`📊 Encontrados ${completedEnrollments.length} cursos completados\n`);

    let generatedCount = 0;
    let skippedCount = 0;

    for (const enrollment of completedEnrollments) {
        // Verificar si ya existe un certificado
        const existingCert = await prisma.certificate.findFirst({
            where: {
                userId: enrollment.userId,
                courseId: enrollment.courseId
            }
        });

        if (existingCert) {
            console.log(`⏭️  Saltando: ${enrollment.user.name} - ${enrollment.course.title}`);
            console.log(`   Ya tiene certificado: ${existingCert.id}\n`);
            skippedCount++;
            continue;
        }

        // Generar nuevo certificado
        try {
            const newCert = await prisma.certificate.create({
                data: {
                    userId: enrollment.userId,
                    courseId: enrollment.courseId,
                    issuedAt: enrollment.completedAt!,
                    certificateUrl: `/api/certificate/placeholder` // Será actualizado con el ID real
                }
            });

            // Actualizar URL con el ID real
            await prisma.certificate.update({
                where: { id: newCert.id },
                data: {
                    certificateUrl: `/api/certificate/${newCert.id}`
                }
            });

            console.log(`✅ GENERADO: ${enrollment.user.name} - ${enrollment.course.title}`);
            console.log(`   Certificate ID: ${newCert.id}`);
            console.log(`   Fecha de emisión: ${newCert.issuedAt}`);
            console.log(`   URL: /api/certificate/${newCert.id}\n`);

            generatedCount++;
        } catch (error) {
            console.error(`❌ Error generando certificado para ${enrollment.user.name} - ${enrollment.course.title}:`, error);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📈 RESUMEN:`);
    console.log(`   ✅ Certificados generados: ${generatedCount}`);
    console.log(`   ⏭️  Certificados existentes: ${skippedCount}`);
    console.log(`   📊 Total procesados: ${completedEnrollments.length}`);
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
