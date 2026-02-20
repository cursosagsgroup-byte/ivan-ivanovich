import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function updatePassword() {
    const email = "notificacionesluis@outlook.com"
    const newPassword = "Ivan2025!"

    console.log(`Updating password for ${email}...`)

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                emailVerified: new Date() // Ensure it's verified
            }
        })

        console.log(`Password updated successfully for user ID: ${user.id}`)
        console.log(`New password is: ${newPassword}`)
    } catch (error) {
        console.error("Error updating password:", error)
    }
}

updatePassword()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
