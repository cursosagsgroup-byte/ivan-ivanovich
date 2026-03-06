import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'hsleipzzig@hotmail.com'
    const newPassword = 'Ivan2025#'

    const hash = await bcrypt.hash(newPassword, 10)

    const updated = await prisma.user.update({
        where: { email },
        data: { password: hash }
    })

    console.log(`✅ Contraseña actualizada para: ${updated.email}`)
    console.log(`📋 Nueva contraseña: ${newPassword}`)
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
