import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function auditUsers() {
    console.log("Starting audit for potential login issues...")

    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            accounts: true,
            emailVerified: true
        }
    })

    console.log(`Scanning ${users.length} users...`)

    let suspiciousUsers = []
    let accountsIssue = 0
    let specialChars = 0

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    for (const user of users) {
        let issues = []

        // Check 1: Invisible characters or non-ASCII in email
        // eslint-disable-next-line no-control-regex
        if (/[^\x00-\x7F]/.test(user.email)) {
            issues.push("Non-ASCII characters in email")
            specialChars++
        }

        // Check 2: Malformed email format
        if (!emailRegex.test(user.email)) {
            issues.push("Invalid email format")
        }

        // Check 3: Spaces in email
        if (user.email.includes(" ")) {
            issues.push("Spaces in email")
        }

        // Check 4: Missing Account link (for OAuth/Credentials consistency)
        // Credentials users might not have Account row in some setups, but usually they do if using adapter
        // Actually, Credentials provider often DOES NOT create Account row in Prisma Adapter unless explicitly handled.
        // So missing account is normal for credentials users.

        if (issues.length > 0) {
            suspiciousUsers.push({
                email: user.email,
                name: user.name,
                issues: issues.join(", ")
            })
        }
    }

    console.log("\n--- AUDIT RESULTS ---")
    console.log(`Total suspicious users found: ${suspiciousUsers.length}`)

    if (suspiciousUsers.length > 0) {
        console.log("Details (first 20):")
        suspiciousUsers.slice(0, 20).forEach(u => {
            console.log(`- ${u.email}: ${u.issues}`)
        })
    } else {
        console.log("No obvious data anomalies found that would block login.")
    }
}

auditUsers()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
