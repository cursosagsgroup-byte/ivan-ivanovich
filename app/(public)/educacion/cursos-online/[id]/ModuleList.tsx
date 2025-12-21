'use client';

import { useState } from 'react';
import { ChevronDown, Play, FileText } from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    videoUrl: string | null;
}

interface ModuleListProps {
    title: string;
    lessons: Lesson[];
}

export default function ModuleList({ title, lessons }: ModuleListProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    <span className="font-medium text-gray-900">{title}</span>
                </div>
                <span className="text-sm text-gray-500">{lessons.length} Lecciones</span>
            </button>
            {isOpen && (
                <div className="bg-white border-t border-gray-200 divide-y divide-gray-100">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                            {lesson.videoUrl ? (
                                <Play className="w-4 h-4 text-[#B70126] flex-shrink-0" />
                            ) : (
                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            )}
                            <span className="text-sm text-gray-700">{lesson.title}</span>
                        </div>
                    ))}
                    {lessons.length === 0 && (
                        <div className="p-4 text-sm text-gray-500 italic">
                            No hay lecciones en este módulo.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
