'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

interface Question {
    id: string;
    question: string;
    options: string | null; // JSON string of options
    correctAnswer: string;
    points: number;
    type: string;
}

interface QuizPlayerProps {
    quizId: string;
    title: string;
    questions: Question[];
    previousAttempt?: {
        score: number;
        passed: boolean;
        answers: Record<string, string>;
    } | null;
    onComplete: (score: number, passed: boolean, answers: Record<string, string>) => void;
}

export default function QuizPlayer({ quizId, title, questions, previousAttempt, onComplete }: QuizPlayerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(previousAttempt?.answers || {});
    const [showResults, setShowResults] = useState(previousAttempt?.passed || false);
    const [score, setScore] = useState(previousAttempt?.score || 0);
    const [passed, setPassed] = useState(previousAttempt?.passed || false);

    // Update state when previousAttempt changes (e.g. after async fetch)
    useEffect(() => {
        if (previousAttempt) {
            console.log('Syncing previous attempt:', previousAttempt);
            setSelectedAnswers(previousAttempt.answers || {});
            setShowResults(previousAttempt.passed);
            setScore(previousAttempt.score);
            setPassed(previousAttempt.passed);
        } else {
            // Reset if no previous attempt (e.g. switching to a new quiz)
            setSelectedAnswers({});
            setShowResults(false);
            setScore(0);
            setPassed(false);
        }
    }, [previousAttempt]);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Parse options safely - handle both string arrays and object arrays
    const getOptions = (optionsStr: string | null): string[] => {
        if (!optionsStr) return [];
        try {
            const parsed = JSON.parse(optionsStr);
            // If it's an array of objects with {text, isCorrect}, extract just the text
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && 'text' in parsed[0]) {
                return parsed.map((opt: any) => opt.text);
            }
            // If it's already an array of strings, return as is
            if (Array.isArray(parsed)) {
                return parsed;
            }
            return [];
        } catch (e) {
            return [];
        }
    };

    const handleOptionSelect = (option: string) => {
        if (showResults) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion.id]: option
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResults();
        }
    };

    const calculateResults = () => {
        let totalPoints = 0;
        let earnedPoints = 0;

        questions.forEach(q => {
            totalPoints += q.points;
            if (selectedAnswers[q.id] === q.correctAnswer) {
                earnedPoints += q.points;
            }
        });

        const finalScore = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const isPassed = finalScore >= 60; // Passing score threshold

        setScore(finalScore);
        setPassed(isPassed);
        setShowResults(true);
        onComplete(finalScore, isPassed, selectedAnswers);
    };

    const handleRetry = () => {
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setShowResults(false);
        setScore(0);
        setPassed(false);
    };

    if (showResults) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                    {passed ? (
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    ) : (
                        <XCircle className="w-10 h-10 text-red-600" />
                    )}
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {passed ? '¡Felicidades! Aprobaste' : 'No aprobado'}
                </h2>

                <p className="text-slate-500 mb-8">
                    Has obtenido una calificación de <span className="font-bold text-slate-900">{score}%</span>
                </p>

                <div className="flex justify-center gap-4">
                    {!passed && (
                        <button
                            onClick={handleRetry}
                            className="flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Intentar de nuevo
                        </button>
                    )}
                    {passed && (
                        <button
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                        >
                            Continuar al siguiente módulo
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-slate-500">
                        Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                        {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Completado
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                        className="bg-slate-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                    {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                    {getOptions(currentQuestion.options).map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all ${selectedAnswers[currentQuestion.id] === option
                                ? 'border-slate-900 bg-slate-50 text-slate-900'
                                : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                }`}
                        >
                            <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedAnswers[currentQuestion.id] === option
                                    ? 'border-slate-900'
                                    : 'border-slate-300'
                                    }`}>
                                    {selectedAnswers[currentQuestion.id] === option && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                                    )}
                                </div>
                                {option}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={!selectedAnswers[currentQuestion.id]}
                        className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${selectedAnswers[currentQuestion.id]
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {currentQuestionIndex < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Finalizar Quiz'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}
