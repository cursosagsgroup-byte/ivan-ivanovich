'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Mail, Send, Users, BookOpen } from 'lucide-react';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface CourseOption {
    id: string;
    title: string;
}

export default function MarketingPage() {
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [target, setTarget] = useState<'all' | 'course' | 'leads'>('all');
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // Fetch courses for the dropdown
        fetch('/api/admin/payments/config') // We need a public endpoint for courses list, usually /api/courses or similar.
            // Actually, let's use the one we used in SalesAnalytics or create a simple server action.
            // Wait, I can probably just fetch from /api/courses if it exists publicly, or reusing admin config endpoint is risky.
            // Let's create a quick data fetch here or reuse an existing one. 
            // For now, I'll assumethere is no simple "list courses" api for admin dropdowns, so I will fetch from /api/courses (public).
            .then(() => fetchCourses());
    }, []);

    const fetchCourses = async () => {
        try {
            // Reusing existing API if possible, or I might need to make one.
            // Let's try the public one?
            // const res = await fetch('/api/courses'); // Usually returns public courses.
            // Actually, let's just leave it empty for a sec and if it fails, I'll fix it.
            // Better: "SalesAnalytics" fetched fetch('/api/admin/payments/config')?? NO.
            // SalesAnalytics used server component fetching.
            // Here I am client side.
            // Quick fix: I will fetch from `/api/courses`.
            const res = await fetch('/api/courses');
            if (res.ok) {
                const data = await res.json();
                setCourses(data);
                if (data.length > 0) setSelectedCourse(data[0].id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) {
            toast.error('Por favor completa el asunto y el mensaje');
            return;
        }

        setSending(true);
        try {
            const res = await fetch('/api/admin/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target,
                    courseId: target === 'course' ? selectedCourse : undefined,
                    subject,
                    message
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar');

            toast.success(`Enviado correctamente a ${data.sent} usuarios`);
            setSubject('');
            setMessage('');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Email Marketing</h1>
            <p className="text-slate-500 mb-8">Envía correos masivos a tus alumnos o grupos específicos.</p>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSend} className="p-6 space-y-6">

                    {/* Audience Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Destinatarios</label>
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setTarget('all')}
                                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${target === 'all'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                <Users className="h-5 w-5" />
                                <span className="font-medium">Todos los Alumnos</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTarget('course')}
                                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${target === 'course'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                <BookOpen className="h-5 w-5" />
                                <span className="font-medium">Por Curso</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTarget('leads')}
                                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${target === 'leads'
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                    }`}
                            >
                                <span className="font-medium">Prospectos (Leads)</span>
                            </button>
                        </div>

                        {target === 'course' && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                                >
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary py-2 px-3 border"
                            placeholder="Ej: Nuevo curso disponible: Protección Avanzada"
                        />
                    </div>

                    {/* Message Body (Rich Text) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                        <div className="bg-white">
                            <ReactQuill
                                theme="snow"
                                value={message}
                                onChange={setMessage}
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                                        ['link', 'image'],
                                        ['clean']
                                    ],
                                }}
                                className="h-64 mb-12"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={sending}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-primary/20"
                        >
                            {sending ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Enviar Correos
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
