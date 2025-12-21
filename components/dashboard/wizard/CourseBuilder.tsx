'use client';

import { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit2, Video, FileText, HelpCircle, X, CheckCircle, Circle } from 'lucide-react';

interface Question {
    id: string;
    type: 'multiple_choice' | 'true_false';
    question: string;
    options: string[];
    correctAnswer: string;
}

interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'quiz' | 'text';
    videoUrl?: string;
    content?: string;
    questions?: Question[];
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

export default function CourseBuilder() {
    const [modules, setModules] = useState<Module[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

    // Form States
    const [lessonForm, setLessonForm] = useState<{
        title: string;
        type: 'video' | 'quiz' | 'text';
        videoUrl: string;
        content: string;
    }>({
        title: '',
        type: 'video',
        videoUrl: '',
        content: ''
    });

    // Quiz Builder State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Question>({
        id: '',
        type: 'multiple_choice',
        question: '',
        options: ['', ''],
        correctAnswer: ''
    });
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);

    const addModule = () => {
        const newModule: Module = {
            id: Math.random().toString(36).substr(2, 9),
            title: 'New Module',
            lessons: [],
        };
        setModules([...modules, newModule]);
    };

    const deleteModule = (moduleId: string) => {
        setModules(modules.filter(m => m.id !== moduleId));
    };

    const openAddLessonModal = (moduleId: string) => {
        setCurrentModuleId(moduleId);
        setLessonForm({ title: '', type: 'video', videoUrl: '', content: '' });
        setQuestions([]);
        setIsModalOpen(true);
    };

    // Quiz Helper Functions
    const addOption = () => {
        setCurrentQuestion({
            ...currentQuestion,
            options: [...currentQuestion.options, '']
        });
    };

    const removeOption = (index: number) => {
        const newOptions = currentQuestion.options.filter((_, i) => i !== index);
        setCurrentQuestion({
            ...currentQuestion,
            options: newOptions
        });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({
            ...currentQuestion,
            options: newOptions
        });
    };

    const saveQuestion = () => {
        if (!currentQuestion.question || !currentQuestion.correctAnswer) return;

        const newQuestion = { ...currentQuestion, id: Math.random().toString(36).substr(2, 9) };
        setQuestions([...questions, newQuestion]);
        setIsAddingQuestion(false);
        setCurrentQuestion({
            id: '',
            type: 'multiple_choice',
            question: '',
            options: ['', ''],
            correctAnswer: ''
        });
    };

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const saveLesson = () => {
        if (!currentModuleId || !lessonForm.title) return;

        const newLesson: Lesson = {
            id: Math.random().toString(36).substr(2, 9),
            title: lessonForm.title,
            type: lessonForm.type,
            videoUrl: lessonForm.videoUrl,
            content: lessonForm.content,
            questions: lessonForm.type === 'quiz' ? questions : undefined
        };

        setModules(modules.map(module => {
            if (module.id === currentModuleId) {
                return { ...module, lessons: [...module.lessons, newLesson] };
            }
            return module;
        }));

        setIsModalOpen(false);
        setCurrentModuleId(null);
    };

    const deleteLesson = (moduleId: string, lessonId: string) => {
        setModules(modules.map(module => {
            if (module.id === moduleId) {
                return { ...module, lessons: module.lessons.filter(l => l.id !== lessonId) };
            }
            return module;
        }));
    };

    const getLessonIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video className="h-4 w-4 text-blue-500" />;
            case 'quiz': return <HelpCircle className="h-4 w-4 text-purple-500" />;
            case 'text': return <FileText className="h-4 w-4 text-green-500" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Course Builder</h2>
                <button
                    onClick={addModule}
                    className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200"
                >
                    <Plus className="h-4 w-4" />
                    Add Module
                </button>
            </div>

            <div className="space-y-4">
                {modules.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                        <p className="text-slate-500">Start by adding a module to your course.</p>
                    </div>
                ) : (
                    modules.map((module) => (
                        <div key={module.id} className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 p-4 flex items-center justify-between border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                                    <span className="font-medium text-slate-900">{module.title}</span>
                                    <button className="text-slate-400 hover:text-primary">
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => deleteModule(module.id)}
                                        className="text-slate-400 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Lessons List */}
                            <div className="bg-white">
                                {module.lessons.length > 0 && (
                                    <div className="divide-y divide-slate-100">
                                        {module.lessons.map((lesson) => (
                                            <div key={lesson.id} className="p-3 pl-8 flex items-center justify-between hover:bg-slate-50">
                                                <div className="flex items-center gap-3">
                                                    <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                                                    {getLessonIcon(lesson.type)}
                                                    <span className="text-sm text-slate-700">{lesson.title}</span>
                                                    {lesson.type === 'video' && lesson.videoUrl && (
                                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                            Video Linked
                                                        </span>
                                                    )}
                                                    {lesson.type === 'quiz' && (
                                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                            {lesson.questions?.length || 0} Questions
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => deleteLesson(module.id, lesson.id)}
                                                    className="text-slate-400 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-4">
                                    <button
                                        onClick={() => openAddLessonModal(module.id)}
                                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-md text-slate-500 hover:border-primary hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Lesson
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Lesson Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Add New Lesson</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Title</label>
                                    <input
                                        type="text"
                                        value={lessonForm.title}
                                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                        placeholder="e.g. Final Exam"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Type</label>
                                    <select
                                        value={lessonForm.type}
                                        onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                    >
                                        <option value="video">Video Lesson</option>
                                        <option value="text">Text / Reading</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>
                            </div>

                            {lessonForm.type === 'video' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Video URL</label>
                                    <input
                                        type="text"
                                        value={lessonForm.videoUrl}
                                        onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                        placeholder="https://vimeo.com/..."
                                    />
                                </div>
                            )}

                            {(lessonForm.type === 'text' || lessonForm.type === 'video') && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        {lessonForm.type === 'video' ? 'Description / Text Content' : 'Lesson Content'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={lessonForm.content}
                                        onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                        className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                        placeholder={lessonForm.type === 'video' ? "Add text content below the video..." : "Enter lesson content..."}
                                    />
                                </div>
                            )}
                            {/* Quiz Builder Section */}
                            {lessonForm.type === 'quiz' && (
                                <div className="border-t border-slate-200 pt-4 mt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-md font-medium text-slate-900">Quiz Questions</h4>
                                        {!isAddingQuestion && (
                                            <button
                                                onClick={() => setIsAddingQuestion(true)}
                                                className="text-sm text-primary hover:text-red-700 font-medium flex items-center gap-1"
                                            >
                                                <Plus className="h-4 w-4" /> Add Question
                                            </button>
                                        )}
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-3 mb-4">
                                        {questions.map((q, idx) => (
                                            <div key={q.id} className="bg-slate-50 p-3 rounded-md border border-slate-200 flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-500">Q{idx + 1}:</span>
                                                        <span className="font-medium text-slate-900">{q.question}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 ml-6">
                                                        Type: {q.type === 'multiple_choice' ? 'Multiple Choice' : 'True/False'} |
                                                        Answer: {q.correctAnswer}
                                                    </p>
                                                </div>
                                                <button onClick={() => deleteQuestion(q.id)} className="text-slate-400 hover:text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Question Form */}
                                    {isAddingQuestion && (
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Question Text</label>
                                                <input
                                                    type="text"
                                                    value={currentQuestion.question}
                                                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                                    placeholder="Enter your question here"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Question Type</label>
                                                <select
                                                    value={currentQuestion.type}
                                                    onChange={(e) => setCurrentQuestion({
                                                        ...currentQuestion,
                                                        type: e.target.value as any,
                                                        options: e.target.value === 'true_false' ? ['True', 'False'] : ['', ''],
                                                        correctAnswer: ''
                                                    })}
                                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                                >
                                                    <option value="multiple_choice">Multiple Choice</option>
                                                    <option value="true_false">True / False</option>
                                                </select>
                                            </div>

                                            {/* Options for Multiple Choice */}
                                            {currentQuestion.type === 'multiple_choice' && (
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-slate-700">Options (Select correct answer)</label>
                                                    {currentQuestion.options.map((option, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                                className={`flex-shrink-0 ${currentQuestion.correctAnswer === option && option !== '' ? 'text-green-600' : 'text-slate-300'}`}
                                                            >
                                                                {currentQuestion.correctAnswer === option && option !== '' ? (
                                                                    <CheckCircle className="h-5 w-5" />
                                                                ) : (
                                                                    <Circle className="h-5 w-5" />
                                                                )}
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={option}
                                                                onChange={(e) => updateOption(idx, e.target.value)}
                                                                className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                                                placeholder={`Option ${idx + 1}`}
                                                            />
                                                            {currentQuestion.options.length > 2 && (
                                                                <button onClick={() => removeOption(idx)} className="text-slate-400 hover:text-red-600">
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={addOption}
                                                        className="text-sm text-primary hover:text-red-700 font-medium flex items-center gap-1 mt-2"
                                                    >
                                                        <Plus className="h-3 w-3" /> Add Option
                                                    </button>
                                                </div>
                                            )}

                                            {/* Options for True/False */}
                                            {currentQuestion.type === 'true_false' && (
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium text-slate-700">Select Correct Answer</label>
                                                    <div className="flex gap-4">
                                                        {['True', 'False'].map((option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: option })}
                                                                className={`px-4 py-2 rounded-md border ${currentQuestion.correctAnswer === option
                                                                    ? 'bg-green-50 border-green-500 text-green-700'
                                                                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                                                                    }`}
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex justify-end gap-2 mt-4">
                                                <button
                                                    onClick={() => setIsAddingQuestion(false)}
                                                    className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={saveQuestion}
                                                    disabled={!currentQuestion.question || !currentQuestion.correctAnswer}
                                                    className="px-3 py-1.5 text-sm text-white bg-slate-900 hover:bg-slate-800 rounded disabled:opacity-50"
                                                >
                                                    Save Question
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveLesson}
                                    disabled={!lessonForm.title}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#B70126] hover:bg-red-800 rounded-md disabled:opacity-50"
                                >
                                    {lessonForm.type === 'quiz' ? `Save Quiz (${questions.length} questions)` : 'Add Lesson'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
