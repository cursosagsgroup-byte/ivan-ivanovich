'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Option {
    text: string;
    isCorrect: boolean;
}

interface Question {
    id?: string;
    question: string;
    type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    options: Option[];
    correctAnswer: string;
    points: number;
    order: number;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    passingScore: number;
    timeLimit: number;
    questions: Question[];
}

export default function QuizEditor({ params }: { params: { quizId: string } }) {
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchQuiz();
    }, [params.quizId]);

    const fetchQuiz = async () => {
        try {
            const response = await fetch(`/api/quizzes/${params.quizId}`);
            if (!response.ok) throw new Error('Failed to fetch quiz');
            const data = await response.json();
            setQuiz(data);
        } catch (error) {
            toast.error('Error loading quiz');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!quiz) return;
        setSaving(true);
        try {
            const response = await fetch(`/api/quizzes/${params.quizId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(quiz),
            });

            if (!response.ok) throw new Error('Failed to save quiz');

            toast.success('Quiz saved successfully');
            router.refresh();
        } catch (error) {
            toast.error('Error saving quiz');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const addQuestion = () => {
        if (!quiz) return;
        const newQuestion: Question = {
            question: '',
            type: 'MULTIPLE_CHOICE',
            options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            correctAnswer: '',
            points: 1,
            order: quiz.questions.length
        };
        setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        if (!quiz) return;
        const newQuestions = [...quiz.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const removeQuestion = (index: number) => {
        if (!quiz) return;
        const newQuestions = quiz.questions.filter((_, i) => i !== index);
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const addOption = (questionIndex: number) => {
        if (!quiz) return;
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
        setQuiz({ ...quiz, questions: newQuestions });
    };

    const updateOption = (questionIndex: number, optionIndex: number, text: string) => {
        if (!quiz) return;
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].options[optionIndex].text = text;

        // If this option is marked correct, update the correctAnswer string too
        if (newQuestions[questionIndex].options[optionIndex].isCorrect) {
            newQuestions[questionIndex].correctAnswer = text;
        }

        setQuiz({ ...quiz, questions: newQuestions });
    };

    const setCorrectOption = (questionIndex: number, optionIndex: number) => {
        if (!quiz) return;
        const newQuestions = [...quiz.questions];

        // Reset all options to false
        newQuestions[questionIndex].options.forEach(opt => opt.isCorrect = false);

        // Set selected option to true
        newQuestions[questionIndex].options[optionIndex].isCorrect = true;
        newQuestions[questionIndex].correctAnswer = newQuestions[questionIndex].options[optionIndex].text;

        setQuiz({ ...quiz, questions: newQuestions });
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        if (!quiz) return;
        const newQuestions = [...quiz.questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
        setQuiz({ ...quiz, questions: newQuestions });
    };

    if (loading) return <div className="p-8 text-center">Loading quiz...</div>;
    if (!quiz) return <div className="p-8 text-center">Quiz not found</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold">Edit Quiz</h1>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-[#B70126] hover:bg-[#9a0120]">
                    {saving ? 'Saving...' : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Quiz Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input
                            value={quiz.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuiz({ ...quiz, title: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                            value={quiz.description || ''}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuiz({ ...quiz, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Passing Score (%)</Label>
                            <Input
                                type="number"
                                value={quiz.passingScore}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuiz({ ...quiz, passingScore: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Time Limit (minutes, 0 for unlimited)</Label>
                            <Input
                                type="number"
                                value={quiz.timeLimit || 0}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Questions ({quiz.questions.length})</h2>
                    <Button onClick={addQuestion} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question
                    </Button>
                </div>

                {quiz.questions.map((question, qIndex) => (
                    <Card key={qIndex} className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeQuestion(qIndex)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <CardContent className="pt-6 space-y-4">
                            <div className="grid gap-2">
                                <Label>Question {qIndex + 1}</Label>
                                <Input
                                    value={question.question}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(qIndex, 'question', e.target.value)}
                                    placeholder="Enter your question here"
                                    className="font-medium"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Options</Label>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-3">
                                        <button
                                            onClick={() => setCorrectOption(qIndex, oIndex)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${option.isCorrect
                                                ? 'border-green-500 bg-green-500 text-white'
                                                : 'border-slate-300 hover:border-green-400 text-transparent'
                                                }`}
                                            title="Mark as correct answer"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>

                                        <Input
                                            value={option.text}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateOption(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className={option.isCorrect ? 'border-green-500 ring-1 ring-green-500' : ''}
                                        />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeOption(qIndex, oIndex)}
                                            className="text-slate-400 hover:text-red-500"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addOption(qIndex)}
                                    className="ml-9 text-slate-500"
                                >
                                    <Plus className="w-3 h-3 mr-2" />
                                    Add Option
                                </Button>
                            </div>

                            <div className="flex items-center gap-4 pt-2 border-t">
                                <div className="flex items-center gap-2">
                                    <Label>Points:</Label>
                                    <Input
                                        type="number"
                                        className="w-20"
                                        value={question.points}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(qIndex, 'points', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
