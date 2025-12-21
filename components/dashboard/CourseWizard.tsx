'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import CourseInfo from './wizard/CourseInfo';
import CourseBuilder from './wizard/CourseBuilder';
import CourseSettings from './wizard/CourseSettings';

const steps = [
    { id: 1, name: 'Course Info', component: CourseInfo },
    { id: 2, name: 'Course Builder', component: CourseBuilder },
    { id: 3, name: 'Settings', component: CourseSettings },
];

export default function CourseWizard() {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const CurrentComponent = steps.find((step) => step.id === currentStep)?.component || CourseInfo;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Progress Steps */}
            <nav aria-label="Progress" className="mb-8">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                    {steps.map((step) => (
                        <li key={step.name} className="md:flex-1">
                            <button
                                onClick={() => setCurrentStep(step.id)}
                                className={`group flex w-full flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${step.id <= currentStep
                                        ? 'border-primary hover:border-red-800'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <span
                                    className={`text-sm font-medium ${step.id <= currentStep ? 'text-primary' : 'text-slate-500'
                                        }`}
                                >
                                    Step {step.id}
                                </span>
                                <span className="text-sm font-medium text-slate-900">{step.name}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Step Content */}
            <div className="mb-8">
                <CurrentComponent />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex justify-center rounded-md bg-[#B70126] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B70126]"
                >
                    {currentStep === steps.length ? 'Publish Course' : 'Next Step'}
                </button>
            </div>
        </div>
    );
}
