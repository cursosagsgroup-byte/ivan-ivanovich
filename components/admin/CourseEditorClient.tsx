'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash, ChevronDown, ChevronRight, BookOpen, FileQuestion, Edit, X } from 'lucide-react';

interface Question {
    id?: string;
    question: string;
    type: string;
    options: string | null;
    correctAnswer: string;
    points: number;
    order: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string | null;
    passingScore: number;
    timeLimit: number | null;
    order: number;
    questions: Question[];
}

interface Lesson {
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
    order: number;
    duration: number | null;
}

interface Module {
    id: string;
    title: string;
    description: string | null;
    order: number;
    lessons: Lesson[];
    quizzes: Quiz[];
    courseId: string;
    createdAt: Date;
}

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string | null;
    published: boolean;
    modules: Module[];
}

export default function CourseEditorClient({ initialCourse }: { initialCourse: Course }) {
    const router = useRouter();
    const [course, setCourse] = useState<Course>(initialCourse);
    const [saving, setSaving] = useState(false);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [lessonForm, setLessonForm] = useState({
        title: '',
        content: '',
        videoUrl: '',
        duration: 0
    });
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [quizForm, setQuizForm] = useState<{
        title: string;
        description: string;
        passingScore: number;
        timeLimit: number;
        questions: Question[];
    }>({
        title: '',
        description: '',
        passingScore: 70,
        timeLimit: 0,
        questions: []
    });

    const saveCourseInfo = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/courses/${course.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    image: course.image,
                    published: course.published
                })
            });
            if (res.ok) {
                alert('Curso actualizado exitosamente');
            }
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Error al guardar el curso');
        } finally {
            setSaving(false);
        }
    };

    const openEditLesson = (lesson: Lesson) => {
        setEditingLesson(lesson);
        setLessonForm({
            title: lesson.title,
            content: lesson.content || '',
            videoUrl: lesson.videoUrl || '',
            duration: lesson.duration || 0
        });
    };

    const saveLesson = async () => {
        if (!editingLesson) return;

        try {
            const res = await fetch(`/api/lessons/${editingLesson.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: lessonForm.title,
                    content: lessonForm.content,
                    videoUrl: lessonForm.videoUrl,
                    order: editingLesson.order,
                    duration: lessonForm.duration
                })
            });
            if (res.ok) {
                setEditingLesson(null);
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving lesson:', error);
            alert('Error al guardar la lección');
        }
    };

    const toggleModule = (moduleId: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(moduleId)) {
            newExpanded.delete(moduleId);
        } else {
            newExpanded.add(moduleId);
        }
        setExpandedModules(newExpanded);
    };

    const addModule = async () => {
        const title = prompt('Título del módulo:');
        if (!title) return;

        try {
            const res = await fetch(`/api/courses/${course.id}/modules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description: '',
                    order: course.modules.length
                })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error adding module:', error);
        }
    };

    const deleteModule = async (moduleId: string) => {
        if (!confirm('¿Eliminar este módulo y todo su contenido?')) return;

        try {
            const res = await fetch(`/api/modules/${moduleId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error deleting module:', error);
        }
    };

    const addLesson = async (moduleId: string) => {
        const title = prompt('Título de la lección:');
        if (!title) return;

        const module = course.modules.find(m => m.id === moduleId);
        try {
            const res = await fetch(`/api/modules/${moduleId}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content: '',
                    videoUrl: '',
                    order: module?.lessons.length || 0,
                    duration: 0
                })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error adding lesson:', error);
        }
    };

    const deleteLesson = async (lessonId: string) => {
        if (!confirm('¿Eliminar esta lección?')) return;

        try {
            const res = await fetch(`/api/lessons/${lessonId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    };

    const addQuiz = async (moduleId: string) => {
        const title = prompt('Título del quiz:');
        if (!title) return;

        const module = course.modules.find(m => m.id === moduleId);
        try {
            const res = await fetch(`/api/modules/${moduleId}/quizzes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description: '',
                    passingScore: 70,
                    timeLimit: 0,
                    order: module?.quizzes.length || 0
                })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error adding quiz:', error);
        }
    };

    const deleteQuiz = async (quizId: string) => {
        if (!confirm('¿Eliminar este quiz?')) return;

        try {
            const res = await fetch(`/api/quizzes/${quizId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const openEditQuiz = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setQuizForm({
            title: quiz.title,
            description: quiz.description || '',
            passingScore: quiz.passingScore || 70,
            timeLimit: quiz.timeLimit || 0,
            questions: quiz.questions || []
        });
    };

    const saveQuiz = async () => {
        if (!editingQuiz) return;

        try {
            // Ensure options are properly stringified for the API if they aren't already
            const formattedQuestions = quizForm.questions.map(q => ({
                ...q,
                options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            }));

            const res = await fetch(`/api/quizzes/${editingQuiz.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: quizForm.title,
                    description: quizForm.description,
                    passingScore: quizForm.passingScore,
                    timeLimit: quizForm.timeLimit,
                    order: editingQuiz.order,
                    questions: formattedQuestions
                })
            });
            if (res.ok) {
                setEditingQuiz(null);
                router.refresh();
            }
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('Error al guardar el quiz');
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/courses" className="flex items-center text-slate-500 hover:text-slate-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Editar Curso</h1>
                </div>
                <button
                    onClick={saveCourseInfo}
                    disabled={saving}
                    className="flex items-center rounded-md bg-[#B70126] px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
                >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Course Basic Info */}
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Información Básica</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Título</label>
                        <input
                            type="text"
                            value={course.title}
                            onChange={(e) => setCourse({ ...course, title: e.target.value })}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Descripción</label>
                        <textarea
                            value={course.description}
                            onChange={(e) => setCourse({ ...course, description: e.target.value })}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Precio ($)</label>
                            <input
                                type="number"
                                value={course.price}
                                onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Estado</label>
                            <select
                                value={course.published ? 'published' : 'draft'}
                                onChange={(e) => setCourse({ ...course, published: e.target.value === 'published' })}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules */}
            <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-slate-900">Contenido del Curso</h2>
                    <button
                        onClick={addModule}
                        className="flex items-center rounded-md bg-[#B70126] px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Módulo
                    </button>
                </div>

                <div className="space-y-3">
                    {course.modules.map((module, index) => (
                        <div key={module.id} className="border border-slate-200 rounded-lg">
                            <div className="flex items-center justify-between p-4 bg-slate-50">
                                <div className="flex items-center space-x-3 flex-1">
                                    <button onClick={() => toggleModule(module.id)} className="text-slate-500">
                                        {expandedModules.has(module.id) ? (
                                            <ChevronDown className="h-5 w-5" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5" />
                                        )}
                                    </button>
                                    <span className="font-medium text-slate-900">
                                        {index + 1}. {module.title}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        ({module.lessons.length} lecciones, {module.quizzes.length} quizzes)
                                    </span>
                                </div>
                                <button
                                    onClick={() => deleteModule(module.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            </div>

                            {expandedModules.has(module.id) && (
                                <div className="p-4 space-y-3">
                                    {/* Lessons */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-slate-700">Lecciones</h4>
                                            <button
                                                onClick={() => addLesson(module.id)}
                                                className="text-sm text-[#B70126] hover:text-red-800"
                                            >
                                                + Agregar Lección
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {module.lessons.map((lesson) => (
                                                <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <BookOpen className="h-4 w-4 text-slate-400" />
                                                        <span className="text-sm">{lesson.title}</span>
                                                        {lesson.videoUrl && (
                                                            <span className="text-xs text-green-600">(Video)</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openEditLesson(lesson)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteLesson(lesson.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quizzes */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-slate-700">Quizzes</h4>
                                            <button
                                                onClick={() => addQuiz(module.id)}
                                                className="text-sm text-[#B70126] hover:text-red-800"
                                            >
                                                + Agregar Quiz
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {module.quizzes.map((quiz) => (
                                                <div key={quiz.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <FileQuestion className="h-4 w-4 text-slate-400" />
                                                        <span className="text-sm">{quiz.title}</span>
                                                        <span className="text-xs text-slate-500">({quiz.questions.length} preguntas)</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => openEditQuiz(quiz)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteQuiz(quiz.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lesson Edit Modal */}
            {editingLesson && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-slate-900">Editar Lección</h3>
                            <button
                                onClick={() => setEditingLesson(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Título</label>
                                <input
                                    type="text"
                                    value={lessonForm.title}
                                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">URL del Video (Vimeo, YouTube, etc.)</label>
                                <input
                                    type="text"
                                    value={lessonForm.videoUrl}
                                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                    placeholder="https://vimeo.com/..."
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Contenido</label>
                                <textarea
                                    value={lessonForm.content}
                                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                    rows={6}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Duración (minutos)</label>
                                <input
                                    type="number"
                                    value={lessonForm.duration}
                                    onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingLesson(null)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveLesson}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#B70126] rounded-md hover:bg-red-800"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quiz Edit Modal */}
            {editingQuiz && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-slate-900">Editar Quiz</h3>
                            <button
                                onClick={() => setEditingQuiz(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid gap-4 p-4 border rounded-lg bg-slate-50">
                                <h4 className="font-medium text-slate-900">Configuración General</h4>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Título</label>
                                    <input
                                        type="text"
                                        value={quizForm.title}
                                        onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Descripción</label>
                                    <textarea
                                        value={quizForm.description}
                                        onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Puntaje Mínimo (%)</label>
                                        <input
                                            type="number"
                                            value={quizForm.passingScore}
                                            onChange={(e) => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">Tiempo Límite (min)</label>
                                        <input
                                            type="number"
                                            value={quizForm.timeLimit}
                                            onChange={(e) => setQuizForm({ ...quizForm, timeLimit: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-medium text-slate-900">Preguntas ({quizForm.questions?.length || 0})</h4>
                                    <button
                                        onClick={() => {
                                            const newQuestion = {
                                                question: '',
                                                type: 'MULTIPLE_CHOICE',
                                                options: JSON.stringify([
                                                    { text: '', isCorrect: false },
                                                    { text: '', isCorrect: false }
                                                ]),
                                                correctAnswer: '',
                                                points: 1,
                                                order: (quizForm.questions?.length || 0)
                                            };
                                            setQuizForm({
                                                ...quizForm,
                                                questions: [...(quizForm.questions || []), newQuestion]
                                            });
                                        }}
                                        className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Agregar Pregunta
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {quizForm.questions?.map((q, qIdx) => {
                                        let options = [];
                                        try {
                                            const rawOptions = q.options;
                                            if (typeof rawOptions === 'string') {
                                                options = JSON.parse(rawOptions);
                                            } else {
                                                options = rawOptions || [];
                                            }
                                        } catch (e) {
                                            options = [];
                                        }

                                        return (
                                            <div key={qIdx} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm relative group">
                                                <button
                                                    onClick={() => {
                                                        const newQuestions = quizForm.questions.filter((_, i) => i !== qIdx);
                                                        setQuizForm({ ...quizForm, questions: newQuestions });
                                                    }}
                                                    className="absolute top-4 right-4 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>

                                                <div className="space-y-4">
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="block text-xs font-medium text-slate-500 mb-1">Pregunta {qIdx + 1}</label>
                                                            <input
                                                                type="text"
                                                                value={q.question}
                                                                onChange={(e) => {
                                                                    const newQuestions = [...quizForm.questions];
                                                                    newQuestions[qIdx] = { ...q, question: e.target.value };
                                                                    setQuizForm({ ...quizForm, questions: newQuestions });
                                                                }}
                                                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border font-medium"
                                                                placeholder="Escribe la pregunta aquí..."
                                                            />
                                                        </div>
                                                        <div className="w-24">
                                                            <label className="block text-xs font-medium text-slate-500 mb-1">Puntos</label>
                                                            <input
                                                                type="number"
                                                                value={q.points}
                                                                onChange={(e) => {
                                                                    const newQuestions = [...quizForm.questions];
                                                                    newQuestions[qIdx] = { ...q, points: parseInt(e.target.value) };
                                                                    setQuizForm({ ...quizForm, questions: newQuestions });
                                                                }}
                                                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 pl-4 border-l-2 border-slate-100">
                                                        <label className="block text-xs font-medium text-slate-500">Opciones de respuesta</label>
                                                        {options.map((opt: any, oIdx: number) => (
                                                            <div key={oIdx} className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => {
                                                                        const newOptions = options.map((o: any, i: number) => ({
                                                                            ...o,
                                                                            isCorrect: i === oIdx
                                                                        }));
                                                                        const newQuestions = [...quizForm.questions];
                                                                        newQuestions[qIdx] = {
                                                                            ...q,
                                                                            options: JSON.stringify(newOptions),
                                                                            correctAnswer: opt.text
                                                                        };
                                                                        setQuizForm({ ...quizForm, questions: newQuestions });
                                                                    }}
                                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${opt.isCorrect
                                                                        ? 'bg-green-500 border-green-500 text-white'
                                                                        : 'border-slate-300 hover:border-green-500'
                                                                        }`}
                                                                    title="Marcar como correcta"
                                                                >
                                                                    {opt.isCorrect && <div className="w-2 h-2 bg-white rounded-full" />}
                                                                </button>

                                                                <input
                                                                    type="text"
                                                                    value={opt.text}
                                                                    onChange={(e) => {
                                                                        const newOptions = [...options];
                                                                        newOptions[oIdx] = { ...opt, text: e.target.value };
                                                                        if (opt.isCorrect) {
                                                                            // Update correct answer text if this option is correct
                                                                            const newQuestions = [...quizForm.questions];
                                                                            newQuestions[qIdx] = {
                                                                                ...q,
                                                                                options: JSON.stringify(newOptions),
                                                                                correctAnswer: e.target.value
                                                                            };
                                                                            setQuizForm({ ...quizForm, questions: newQuestions });
                                                                        } else {
                                                                            const newQuestions = [...quizForm.questions];
                                                                            newQuestions[qIdx] = {
                                                                                ...q,
                                                                                options: JSON.stringify(newOptions)
                                                                            };
                                                                            setQuizForm({ ...quizForm, questions: newQuestions });
                                                                        }
                                                                    }}
                                                                    className={`flex-1 block rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border ${opt.isCorrect ? 'border-green-500 ring-1 ring-green-500' : ''
                                                                        }`}
                                                                    placeholder={`Opción ${oIdx + 1}`}
                                                                />

                                                                <button
                                                                    onClick={() => {
                                                                        const newOptions = options.filter((_: any, i: number) => i !== oIdx);
                                                                        const newQuestions = [...quizForm.questions];
                                                                        newQuestions[qIdx] = {
                                                                            ...q,
                                                                            options: JSON.stringify(newOptions)
                                                                        };
                                                                        setQuizForm({ ...quizForm, questions: newQuestions });
                                                                    }}
                                                                    className="text-slate-400 hover:text-red-500"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => {
                                                                const newOptions = [...options, { text: '', isCorrect: false }];
                                                                const newQuestions = [...quizForm.questions];
                                                                newQuestions[qIdx] = {
                                                                    ...q,
                                                                    options: JSON.stringify(newOptions)
                                                                };
                                                                setQuizForm({ ...quizForm, questions: newQuestions });
                                                            }}
                                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center mt-2"
                                                        >
                                                            <Plus className="w-3 h-3 mr-1" /> Agregar Opción
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    onClick={() => setEditingQuiz(null)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveQuiz}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#B70126] rounded-md hover:bg-red-800"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
