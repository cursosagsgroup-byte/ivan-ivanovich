import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const enPosts = await prisma.blogPost.findMany({
    where: { language: 'en' },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
    }
  })

  console.log('--- English Posts Found ---')
  enPosts.forEach(post => {
    console.log(`ID: ${post.id}`)
    console.log(`Title: ${post.title}`)
    console.log(`Slug: ${post.slug}`)
    console.log(`Excerpt: ${post.excerpt?.substring(0, 100)}...`)
    console.log(`Content Prefix: ${post.content?.substring(0, 200).replace(/\n/g, ' ')}...`)
    console.log('---------------------------')
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
