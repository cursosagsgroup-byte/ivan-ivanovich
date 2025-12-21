import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@ivanivanovich.com' },
        update: {},
        create: {
            email: 'admin@ivanivanovich.com',
            name: 'Admin',
            password,
            role: 'ADMIN'
        }
    })

    console.log('Admin user created:', admin)
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
