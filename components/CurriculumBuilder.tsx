'use client';

import { useState } from 'react';
import { Plus, GripVertical, Trash2, FileText, Video } from 'lucide-react';

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'quiz' | 'text';
}

interface Topic {
    id: string;
    title: string;
    lessons: Lesson[];
}

export default function CurriculumBuilder() {
    const [topics, setTopics] = useState<Topic[]>([
        {
            id: '1',
            title: 'Introduction',
            lessons: [
                { id: '1-1', title: 'Welcome to the Course', type: 'video' },
                { id: '1-2', title: 'Course Overview', type: 'text' },
            ],
        },
    ]);

    const addTopic = () => {
        const newTopic: Topic = {
            id: Date.now().toString(),
            title: 'New Topic',
            lessons: [],
        };
        setTopics([...topics, newTopic]);
    };

    const addLesson = (topicId: string) => {
        const newLesson: Lesson = {
            id: Date.now().toString(),
            title: 'New Lesson',
            type: 'video',
        };
        setTopics(
            topics.map((topic) =>
                topic.id === topicId
                    ? { ...topic, lessons: [...topic.lessons, newLesson] }
                    : topic
            )
        );
    };

    const deleteTopic = (topicId: string) => {
        setTopics(topics.filter((topic) => topic.id !== topicId));
    };

    const deleteLesson = (topicId: string, lessonId: string) => {
        setTopics(
            topics.map((topic) =>
                topic.id === topicId
                    ? { ...topic, lessons: topic.lessons.filter((l) => l.id !== lessonId) }
                    : topic
            )
        );
    };

    return (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-slate-900">Curriculum</h2>
                <button
                    onClick={addTopic}
                    className="flex items-center rounded-md bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Topic
                </button>
            </div>

            <div className="space-y-6">
                {topics.map((topic) => (
                    <div key={topic.id} className="rounded-lg border border-border bg-slate-50">
                        <div className="flex items-center justify-between border-b border-border px-4 py-3">
                            <div className="flex items-center">
                                <GripVertical className="mr-3 h-5 w-5 text-slate-400 cursor-move" />
                                <input
                                    type="text"
                                    value={topic.title}
                                    onChange={(e) => {
                                        const newTitle = e.target.value;
                                        setTopics(topics.map(t => t.id === topic.id ? { ...t, title: newTitle } : t));
                                    }}
                                    className="bg-transparent font-medium text-slate-900 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => addLesson(topic.id)}
                                    className="flex items-center rounded text-xs font-medium text-primary hover:text-primary-hover"
                                >
                                    <Plus className="mr-1 h-3 w-3" />
                                    Add Lesson
                                </button>
                                <button
                                    onClick={() => deleteTopic(topic.id)}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            {topic.lessons.length === 0 && (
                                <p className="text-sm text-slate-500 italic text-center py-2">No lessons yet.</p>
                            )}
                            {topic.lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    className="flex items-center justify-between rounded-md bg-white border border-border px-3 py-2"
                                >
                                    <div className="flex items-center">
                                        <GripVertical className="mr-3 h-4 w-4 text-slate-300 cursor-move" />
                                        {lesson.type === 'video' ? (
                                            <Video className="mr-3 h-4 w-4 text-blue-500" />
                                        ) : (
                                            <FileText className="mr-3 h-4 w-4 text-green-500" />
                                        )}
                                        <input
                                            type="text"
                                            value={lesson.title}
                                            onChange={(e) => {
                                                const newTitle = e.target.value;
                                                setTopics(topics.map(t =>
                                                    t.id === topic.id
                                                        ? { ...t, lessons: t.lessons.map(l => l.id === lesson.id ? { ...l, title: newTitle } : l) }
                                                        : t
                                                ));
                                            }}
                                            className="bg-transparent text-sm text-slate-700 focus:outline-none w-full"
                                        />
                                    </div>
                                    <button
                                        onClick={() => deleteLesson(topic.id, lesson.id)}
                                        className="text-slate-300 hover:text-red-500"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
