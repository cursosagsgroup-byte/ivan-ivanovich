import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default async function AdminBlogPage() {
    const posts = await prisma.blogPost.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            author: true,
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
                <Link
                    href="/admin/blog/new"
                    className="flex items-center gap-2 rounded-md bg-[#B70126] px-4 py-2 text-sm font-medium text-white hover:bg-red-800 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New Post
                </Link>
            </div>

            <div className="rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Title</th>
                                <th className="px-6 py-3 font-medium">Author</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Language</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {post.title}
                                        <div className="text-xs text-slate-500 font-normal truncate max-w-xs">
                                            /{post.slug}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {post.author?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${post.published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${post.language === 'en'
                                            ? 'bg-blue-50 text-blue-700 ring-blue-600/20'
                                            : 'bg-red-50 text-red-700 ring-red-600/10'
                                            }`}>
                                            {post.language === 'en' ? 'English' : 'Español'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                                title="View Live"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/blog/${post.id}`}
                                                className="rounded p-1 text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            {/* Delete button would need client component or server action form */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No posts found. Create your first one!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
