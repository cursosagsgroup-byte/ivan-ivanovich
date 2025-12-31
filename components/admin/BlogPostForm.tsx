'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface BlogPostFormProps {
    postId?: string; // If present, we are editing
}

export default function BlogPostForm({ postId }: BlogPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!postId && postId !== 'new');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        published: false,
        language: 'es',
    });

    useEffect(() => {
        if (postId && postId !== 'new') {
            fetch(`/api/blog/${postId}`)
                .then((res) => res.json())
                .then((data) => {
                    setFormData({
                        title: data.title || '',
                        slug: data.slug || '',
                        excerpt: data.excerpt || '',
                        content: data.content || '',
                        image: data.image || '',
                        published: data.published || false,
                        language: data.language || 'es',
                    });
                    setFetching(false);
                })
                .catch((err) => {
                    console.error(err);
                    setFetching(false);
                });
        }
    }, [postId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if slug is empty or hasn't been manually edited (simple heuristic)
        if (name === 'title' && !postId) {
            const slug = value.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = postId && postId !== 'new' ? `/api/blog/${postId}` : '/api/blog';
            const method = postId && postId !== 'new' ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Something went wrong');
            }

            router.push('/admin/blog');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save post');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/blog/${postId}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            router.push('/admin/blog');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to delete post');
            setLoading(false);
        }
    }

    if (fetching) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blog"
                        className="rounded-full p-2 hover:bg-slate-100 text-slate-500"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {postId && postId !== 'new' ? 'Edit Post' : 'Create New Post'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    {postId && postId !== 'new' && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            disabled={loading}
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-md bg-[#B70126] px-6 py-2 text-sm font-medium text-white hover:bg-red-800 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Enter post title"
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                                Slug
                            </label>
                            <input
                                type="text"
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                placeholder="url-friendly-slug"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                                Content (HTML supported)
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={15}
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm font-mono"
                                    placeholder="<p>Write your content here...</p>"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Banners will be automatically injected after the 2nd paragraph and distributed throughout the content.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="font-medium text-slate-900">Publishing</h3>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                name="published"
                                checked={formData.published}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="published" className="text-sm text-slate-700">
                                Published
                            </label>
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">
                                Language
                            </label>
                            <select
                                id="language"
                                name="language"
                                value={formData.language}
                                onChange={handleChange}
                                className="block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                        <h3 className="font-medium text-slate-900">Meta & Media</h3>

                        <div>
                            <label htmlFor="excerpt" className="block text-sm font-medium text-slate-700">
                                Excerpt
                            </label>
                            <textarea
                                id="excerpt"
                                name="excerpt"
                                rows={3}
                                value={formData.excerpt}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                placeholder="Short summary..."
                            />
                        </div>

                        <div>
                            <label htmlFor="image" className="block text-sm font-medium text-slate-700">
                                Featured Image URL
                            </label>
                            <input
                                type="text"
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                placeholder="/images/blog/..."
                            />
                            {formData.image && (
                                <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
