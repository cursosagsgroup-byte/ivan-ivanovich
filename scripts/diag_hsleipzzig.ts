import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'hsleipzzig@hotmail.com';
    console.log(`\n========== DIAGNÓSTICO DE USUARIO ==========`);
    console.log(`Email: ${email}`);
    console.log(`=============================================\n`);

    const user = await (prisma.user as any).findUnique({
        where: { email },
        include: {
            accounts: true,
            enrollments: {
                include: { course: { select: { title: true } } }
            }
        }
    });

    if (!user) {
        console.log('RESULTADO: ❌ USUARIO NO ENCONTRADO');
        const similar = await (prisma.user as any).findMany({
            where: { email: { contains: 'hsleipzzig', mode: 'insensitive' } }
        });
        if (similar.length > 0) {
            console.log('⚠️  Emails similares encontrados:');
            similar.forEach((u: any) => console.log(`  - "${u.email}"`));
        } else {
            console.log('No hay registros similares.');
        }
        return;
    }

    console.log(`RESULTADO: ✅ USUARIO ENCONTRADO`);
    console.log(`\n--- DATOS BÁSICOS ---`);
    console.log(`ID:           ${user.id}`);
    console.log(`Nombre:       ${user.name || '(sin nombre)'}`);
    console.log(`Email:        ${user.email}`);
    console.log(`Teléfono:     ${user.phone || '❌ SIN TELÉFONO'}`);
    console.log(`País:         ${user.country || '(no especificado)'}`);
    console.log(`Rol:          ${user.role}`);
    console.log(`Idioma:       ${user.language}`);
    console.log(`Creado:       ${user.createdAt}`);
    console.log(`Actualizado:  ${user.updatedAt}`);

    console.log(`\n--- AUTENTICACIÓN ---`);
    if (user.password) {
        console.log(`✅ Tiene contraseña (hash) → Login por credenciales posible`);
    } else {
        console.log(`❌ Sin contraseña → NO puede hacer login por email/contraseña`);
    }
    console.log(`Email verificado: ${user.emailVerified ? '✅ ' + user.emailVerified : '⚠️  NO verificado'}`);

    console.log(`\n--- OAUTH ---`);
    if (!user.accounts || user.accounts.length === 0) {
        console.log(`Sin cuentas OAuth vinculadas`);
    } else {
        user.accounts.forEach((a: any) => console.log(`  - ${a.provider} (${a.type})`));
    }

    console.log(`\n--- RECUPERACIÓN DE CONTRASEÑA ---`);
    console.log(`Email: ${user.email}`);
    console.log(`Teléfono/WhatsApp: ${user.phone || '❌ NO REGISTRADO - Por eso no llegan mensajes de WA'}`);

    console.log(`\n--- CURSOS INSCRITOS ---`);
    if (!user.enrollments || user.enrollments.length === 0) {
        console.log(`Sin cursos inscritos`);
    } else {
        user.enrollments.forEach((e: any) => {
            console.log(`  - ${e.course?.title || e.courseId} | Progreso: ${e.progress || 0}%`);
        });
    }

    console.log(`\n========== FIN ==========\n`);
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
