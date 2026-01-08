'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Menu, X, PlayCircle, FileText, HelpCircle, BrainCircuit, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QuizPlayer from './QuizPlayer';

// Helper function to extract Vimeo video ID from URL
function extractVimeoId(url: string): string {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
}

interface Lesson {
    id: string;
    title: string;
    description?: string | null;
    videoUrl?: string | null;
    vimeoUrl?: string | null; // Add alternative field name
    duration?: number | null;
    isCompleted: boolean;
    isLocked?: boolean;
    type: 'video' | 'quiz' | 'text';
    questions?: any[]; // For quizzes
    lastAttemptScore?: number | null;
}

interface Module {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CoursePlayerProps {
    courseId: string;
    courseTitle: string;
    modules: Module[];
    initialProgress: number;
    userId: string;
}

export default function CoursePlayer({ courseId, courseTitle, modules, initialProgress, userId }: CoursePlayerProps) {
    const router = useRouter();
    const [activeModuleId, setActiveModuleId] = useState<string>(modules[0]?.id || '');
    const [activeLessonId, setActiveLessonId] = useState<string>(modules[0]?.lessons[0]?.id || '');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isClient, setIsClient] = useState(false);
    const [previousQuizAttempt, setPreviousQuizAttempt] = useState<{
        score: number;
        passed: boolean;
        answers: Record<string, string>;
    } | null>(null);

    useEffect(() => {
        setIsClient(true);
        console.log('=== CLIENT SIDE DEBUG ===');
        console.log('CoursePlayer received modules:', JSON.stringify(modules, null, 2));

        // Debug quiz completion
        const quizzes = modules.flatMap(m => m.lessons).filter(l => l.type === 'quiz');
        console.log('Quizzes status:', quizzes.map(q => ({ title: q.title, isCompleted: q.isCompleted })));

        // Log first module and lesson details
        if (modules.length > 0) {
            console.log('First module:', modules[0].title);
            console.log('First module lessons:', modules[0].lessons.length);

            if (modules[0].lessons.length > 0) {
                const firstLesson = modules[0].lessons[0];
                console.log('First lesson details:');
                console.log('  - Title:', firstLesson.title);
                console.log('  - VideoURL:', firstLesson.videoUrl);
                console.log('  - VideoURL type:', typeof firstLesson.videoUrl);
                console.log('  - VideoURL is null?', firstLesson.videoUrl === null);
                console.log('  - VideoURL is empty?', firstLesson.videoUrl === '');
            }
        }

        // Count lessons with and without videos
        const allLessons = modules.flatMap(m => m.lessons);
        const withVideo = allLessons.filter(l => l.videoUrl && l.videoUrl.trim() !== '');
        const withoutVideo = allLessons.filter(l => !l.videoUrl || l.videoUrl.trim() === '');
        console.log(`Total lessons: ${allLessons.length}`);
        console.log(`Lessons WITH video: ${withVideo.length}`);
        console.log(`Lessons WITHOUT video: ${withoutVideo.length}`);
        console.log('========================');
    }, [modules]);

    // Load previous quiz attempt when switching to a quiz lesson
    useEffect(() => {
        // Reset state immediately when changing lessons
        setPreviousQuizAttempt(null);

        const currentLesson = allLessons.find(l => l.id === activeLessonId);
        if (currentLesson?.type === 'quiz') {
            fetch(`/api/quizzes/${currentLesson.id}/attempt`)
                .then(res => res.json())
                .then(data => {
                    if (data.attempt) {
                        setPreviousQuizAttempt(data.attempt);
                    } else {
                        setPreviousQuizAttempt(null);
                    }
                })
                .catch(error => {
                    console.error('Error loading quiz attempt:', error);
                    setPreviousQuizAttempt(null);
                });
        } else {
            setPreviousQuizAttempt(null);
        }
    }, [activeLessonId]);

    // Flatten lessons for easier navigation
    const allLessons = modules.flatMap(m => m.lessons);
    const currentLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);
    const currentLesson = allLessons[currentLessonIndex];

    const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;
    const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

    const [isLoading, setIsLoading] = useState(false);

    const handleLessonChange = async (lessonId: string) => {
        if (isLoading) return; // Prevent double clicks

        // Check if lesson is locked (and not currently unlocking via refresh)
        const lesson = allLessons.find(l => l.id === lessonId);
        if (lesson?.isLocked) {
            // If we are actively completing the previous lesson, we might want to wait?
            // But for now, just return to prevent confusion.
            if (!activeLessonId) return;
        }

        setIsLoading(true);

        // Mark current lesson as complete before attempting to move
        if (activeLessonId && activeLessonId !== lessonId) {
            try {
                await fetch('/api/lessons/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessonId: activeLessonId })
                });
                console.log('✅ Lesson marked as complete:', activeLessonId);
                router.refresh();
                // Wait a bit for the refresh to happen? 
                // We rely on the UI update to clear loading, or the component remounting/updating props.
            } catch (error) {
                console.error('Error marking lesson complete:', error);
            }
        }

        // Re-check lock after potential completion? 
        // No, client state is stale until refresh comes back.
        // We will optimistically enforce the change visually but the true unlock happens on server.

        setActiveLessonId(lessonId);
        const module = modules.find(m => m.lessons.some(l => l.id === lessonId));
        if (module) setActiveModuleId(module.id);

        // Reset loading after a delay or effect
        setTimeout(() => setIsLoading(false), 1000);
    };



    if (!isClient) return null; // Prevent hydration mismatch for player

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-80 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
                        <Link href="/mi-cuenta" className="flex items-center text-sm hover:text-slate-300 transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Volver al Dashboard
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Course Title & Progress */}
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <h2 className="font-bold text-slate-800 mb-3 leading-tight">{courseTitle}</h2>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                            <div
                                className="bg-[#B70126] h-2 rounded-full transition-all duration-500"
                                style={{ width: `${initialProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 text-right">{initialProgress}% Completado</p>
                    </div>

                    {/* Modules List */}
                    <div className="flex-1 overflow-y-auto">
                        {modules.map((module) => (
                            <div key={module.id} className="border-b border-slate-100">
                                <button
                                    onClick={() => setActiveModuleId(activeModuleId === module.id ? '' : module.id)}
                                    className="w-full px-4 py-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors"
                                >
                                    <span className="font-semibold text-sm text-slate-700 text-left">{module.title}</span>
                                    <ChevronRight
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeModuleId === module.id ? 'rotate-90' : ''
                                            }`}
                                    />
                                </button>

                                {activeModuleId === module.id && (
                                    <div className="bg-white">
                                        {module.lessons.map((lesson) => (
                                            <button
                                                key={lesson.id}
                                                onClick={() => handleLessonChange(lesson.id)}
                                                disabled={lesson.isLocked}
                                                className={`w-full px-4 py-3 flex items-start gap-3 text-sm transition-colors border-l-4 ${lesson.isLocked
                                                    ? 'border-transparent bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                                                    : activeLessonId === lesson.id
                                                        ? 'border-[#B70126] bg-red-50 text-[#B70126]'
                                                        : 'border-transparent hover:bg-slate-50 text-slate-600'
                                                    }`}
                                            >
                                                <div className="mt-0.5">
                                                    {lesson.isLocked ? (
                                                        <Lock className="w-4 h-4 text-slate-400" />
                                                    ) : lesson.isCompleted ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : activeLessonId === lesson.id ? (
                                                        lesson.type === 'quiz' ? <BrainCircuit className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />
                                                    ) : (
                                                        lesson.type === 'quiz' ? <BrainCircuit className="w-4 h-4 text-slate-300" /> : <Circle className="w-4 h-4 text-slate-300" />
                                                    )}
                                                </div>
                                                <span className="text-left leading-snug">{lesson.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar (Mobile) */}
                <div className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="mr-4">
                        <Menu className="w-6 h-6 text-slate-700" />
                    </button>
                    <span className="font-semibold text-slate-800 truncate">{currentLesson?.title}</span>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
                        {currentLesson ? (
                            <div className="space-y-8">
                                {currentLesson.type === 'quiz' ? (
                                    <QuizPlayer
                                        key={currentLesson.id}
                                        quizId={currentLesson.id}
                                        title={currentLesson.title}
                                        questions={currentLesson.questions || []}
                                        previousAttempt={previousQuizAttempt}
                                        onNext={() => nextLesson && handleLessonChange(nextLesson.id)}
                                        onComplete={async (score, passed, answers) => {
                                            console.log('Quiz completed:', score, passed);
                                            try {
                                                await fetch('/api/quizzes/submit', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        quizId: currentLesson.id,
                                                        score: score,
                                                        passed: passed,
                                                        answers: answers
                                                    })
                                                });
                                                console.log('✅ Quiz attempt saved');
                                                router.refresh();
                                            } catch (error) {
                                                console.error('Error saving quiz attempt:', error);
                                            }
                                        }}
                                    />
                                ) : (
                                    <>
                                        {/* Video Player */}
                                        {(currentLesson.videoUrl || currentLesson.vimeoUrl) && (
                                            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                                                <iframe
                                                    src={`https://player.vimeo.com/video/${extractVimeoId(currentLesson.videoUrl || currentLesson.vimeoUrl || '')}?badge=0&autopause=0&player_id=0&app_id=58479`}
                                                    frameBorder="0"
                                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                    title={currentLesson.title}
                                                />
                                            </div>
                                        )}

                                        {/* Lesson Header */}
                                        <div>
                                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                                                {currentLesson.title}
                                            </h1>

                                            {/* Navigation Buttons */}
                                            <div className="flex flex-wrap gap-4 justify-between items-center py-6 border-t border-b border-slate-100">
                                                <button
                                                    onClick={() => prevLesson && handleLessonChange(prevLesson.id)}
                                                    disabled={!prevLesson}
                                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${prevLesson
                                                        ? 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                        : 'text-slate-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                                    Anterior
                                                </button>

                                                <button
                                                    onClick={() => nextLesson && handleLessonChange(nextLesson.id)}
                                                    disabled={!nextLesson || isLoading}
                                                    className={`flex items-center px-6 py-2 rounded-lg text-sm font-medium transition-colors ${nextLesson && !isLoading
                                                        ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20'
                                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    {isLoading ? 'Procesando...' : 'Siguiente Lección'}
                                                    <ChevronRight className="w-4 h-4 ml-2" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Lesson Description */}
                                        {currentLesson.description && (
                                            <div className="prose prose-slate prose-lg max-w-none mt-8">
                                                <div
                                                    className="[&>p]:mb-4 [&>p]:leading-relaxed [&>h1]:mt-8 [&>h1]:mb-4 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:mt-4 [&>h3]:mb-2 [&>ul]:mb-4 [&>ul]:mt-4 [&>ol]:mb-4 [&>ol]:mt-4 [&>li]:mb-2"
                                                    dangerouslySetInnerHTML={{ __html: currentLesson.description }}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <HelpCircle className="w-16 h-16 mb-4" />
                                <p>Selecciona una lección para comenzar</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
