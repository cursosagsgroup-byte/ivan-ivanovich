import CourseWizard from '@/components/dashboard/CourseWizard';

export default function NewCoursePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
            </div>
            <CourseWizard />
        </div>
    );
}
