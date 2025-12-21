import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const language = searchParams.get('language');

        const whereClause: any = {
            published: true,
        };

        if (language) {
            whereClause.language = language;
        }

        const posts = await prisma.blogPost.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                author: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { title, slug, content, excerpt, image, published, language } = body;

        // Basic validation
        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check for duplicate slug
        const existing = await prisma.blogPost.findUnique({
            where: { slug },
        });

        if (existing) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                excerpt,
                image,
                published: published || false,
                language: language || 'es',
                authorId: session.user.id,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
