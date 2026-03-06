import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'jprovandrope@icloud.com';

    // Búsqueda exacta
    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            password: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            enrollments: {
                select: {
                    id: true,
                    courseId: true,
                    progress: true,
                    enrolledAt: true,
                }
            },
            accounts: { select: { provider: true, type: true } },
        }
    });

    if (!user) {
        console.log('❌ Usuario NO encontrado con email exacto:', email);

        // Búsqueda parcial por si hay typo
        const similar = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: 'jprovan' } },
                    { email: { contains: 'provandrope' } },
                    { name: { contains: 'provan', mode: 'insensitive' } },
                ]
            },
            select: { email: true, name: true, role: true, createdAt: true }
        });

        if (similar.length > 0) {
            console.log('\n🔍 Usuarios similares encontrados:');
            similar.forEach(u => console.log(' -', u.email, '|', u.name, '|', u.role, '| creado:', u.createdAt));
        } else {
            console.log('🔍 Ningún usuario similar encontrado en la BD.');
        }
        return;
    }

    console.log('\n✅ Usuario encontrado:');
    console.log('  ID:', user.id);
    console.log('  Nombre:', user.name);
    console.log('  Email:', user.email);
    console.log('  Teléfono:', user.phone || '(sin teléfono)');
    console.log('  Tiene contraseña:', !!user.password, user.password ? '(longitud: ' + user.password.length + ')' : '(SIN CONTRASEÑA - solo OAuth)');
    console.log('  Rol:', user.role);
    console.log('  Creado:', user.createdAt);
    console.log('  Actualizado:', user.updatedAt);
    console.log('  Inscripciones:', user.enrollments.length);
    console.log('  Proveedores OAuth:', user.accounts.map((a: any) => a.provider).join(', ') || 'ninguno (usa contraseña)');
    user.enrollments.forEach((e: any) =>
        console.log('  - Enrollment:', e.id, '| Progreso:', e.progress + '%', '| Inscrito:', e.enrolledAt)
    );
}

main().catch(console.error).finally(() => prisma.$disconnect());
