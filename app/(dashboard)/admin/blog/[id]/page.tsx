import BlogPostForm from '@/components/admin/BlogPostForm';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
    const { id } = await params;
    return <BlogPostForm postId={id} />;
}
