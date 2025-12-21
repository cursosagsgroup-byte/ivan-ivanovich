'use client';

import { useState } from 'react';

export default function CourseInfo() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        thumbnail: null as File | null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                        Course Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                        placeholder="e.g. Advanced Executive Protection"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                        placeholder="Course description..."
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                        >
                            <option value="">Select a category</option>
                            <option value="security">Security</option>
                            <option value="protection">Executive Protection</option>
                            <option value="intelligence">Intelligence</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-slate-700">
                            Difficulty Level
                        </label>
                        <select
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
