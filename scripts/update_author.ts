
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Find the user who has authored posts. 
    // If there are multiple, we'll see. Typically there's one admin.
    const posts = await prisma.blogPost.findFirst({
        include: { author: true }
    });

    if (!posts) {
        console.log("No posts found to determine current author.");
        // Try to find any user
        const user = await prisma.user.findFirst();
        if (user) {
            console.log(`Found user: ${user.name}`);
            await updateUser(user.id);
        }
        return;
    }

    const authorId = posts.authorId;
    console.log(`Current author ID: ${authorId}, Name: ${posts.author.name}`);

    await updateUser(authorId);
}

async function updateUser(id: string) {
    await prisma.user.update({
        where: { id: id },
        data: {
            name: "Ivan Ivanovich",
            image: "/images/ivan-avatar.jpg"
        }
    });
    console.log("User updated to Ivan Ivanovich with new avatar.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
