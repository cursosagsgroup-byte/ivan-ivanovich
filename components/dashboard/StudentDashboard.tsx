'use client';

import { PlayCircle, Clock, Award, Download, User, Mail, Phone, MapPin, Calendar, Upload } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

interface EnrolledCourse {
    id: string;
    title: string;
    thumbnail: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    completedAt: string | null;
    certificateAvailable: boolean;
    certificateId?: string;
}


interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
    birthdate: string;
    photo: string;
}

interface StudentDashboardProps {
    enrolledCourses: EnrolledCourse[];
    profileData: ProfileData;
}

export default function StudentDashboard({ enrolledCourses, profileData: initialProfileData }: StudentDashboardProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'certificates' | 'logout'>('profile');
    const [profileData, setProfileData] = useState(initialProfileData);
    const [isEditing, setIsEditing] = useState(false);
    const photoInputRef = useRef<HTMLInputElement>(null);

    const completedCourses = enrolledCourses.filter(c => c.certificateAvailable);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="pt-8 pb-8 lg:pt-12 lg:pb-12 px-4 sm:px-6 lg:px-8 mx-auto max-w-[90%]">
                <div className="relative rounded-[30px] overflow-hidden bg-[#0B121F] isolate shadow-2xl">
                    <div className="absolute inset-0 -z-10 opacity-40">
                        <img
                            src="/course-hero-bg.png"
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="mx-auto max-w-full px-6 py-12 lg:px-12 lg:py-16 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column: Title */}
                            <div className="text-left">
                                <div className="inline-block bg-[#B70126] rounded-full px-8 py-3 mb-6">
                                    <span className="text-white font-bold text-xl lg:text-2xl uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
                                        {profileData.name}
                                    </span>
                                </div>
                                <h1 className="text-6xl lg:text-8xl font-normal text-white uppercase leading-none" style={{ fontFamily: 'var(--font-bebas)' }}>
                                    {t('dashboard.myProfile')}
                                </h1>
                            </div>

                            {/* Right Column: Image */}
                            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl">
                                <img
                                    src={profileData.photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Tabs Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
                    <div className="border-b border-slate-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                👤 {t('dashboard.tabs.profile')}
                            </button>
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'courses'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                📚 {t('dashboard.tabs.courses')}
                            </button>
                            <button
                                onClick={() => setActiveTab('certificates')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'certificates'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                🎓 {t('dashboard.tabs.certificates')}
                            </button>
                            <button
                                onClick={() => setActiveTab('logout')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'logout'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                🚪 {t('dashboard.tabs.logout')}
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Mi Perfil Tab */}
                        {activeTab === 'profile' && (
                            <div className="max-w-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-slate-900">{t('dashboard.personalInfo')}</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                                    >
                                        {isEditing ? t('dashboard.saveChanges') : t('dashboard.editProfile')}
                                    </button>
                                </div>

                                {/* Profile Photo Upload */}
                                <div className="mb-8 flex flex-col items-center">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 shadow-lg">
                                            <img
                                                src={profileData.photo}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => photoInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                            >
                                                <Upload className="w-6 h-6 text-white" />
                                            </button>
                                        )}
                                        <input
                                            type="file"
                                            ref={photoInputRef}
                                            onChange={handlePhotoUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">{t('dashboard.profilePhoto')}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                <User className="w-4 h-4 inline mr-2" />
                                                {t('auth.fullName')}
                                            </label>
                                            <input
                                                type="text"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                {t('auth.email')}
                                            </label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                {t('dashboard.phone')}
                                            </label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                {t('dashboard.birthdate')}
                                            </label>
                                            <input
                                                type="date"
                                                value={profileData.birthdate}
                                                onChange={(e) => setProfileData({ ...profileData, birthdate: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            {t('dashboard.address')}
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            💡 <strong>{t('dashboard.note')}:</strong> {t('dashboard.automatedData')}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mis Cursos Tab */}
                        {activeTab === 'courses' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {enrolledCourses.map((course) => (
                                    <div key={course.id} className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow group border border-slate-200">
                                        <div className="relative h-48 w-full overflow-hidden">
                                            <img
                                                src={course.thumbnail}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                            {course.certificateAvailable && (
                                                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                    ✓ {t('dashboard.completed')}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 min-h-[3rem]">
                                                {course.title}
                                            </h3>

                                            <div className="mb-4">
                                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                                    <span>{course.progress}% {t('dashboard.completed')}</span>
                                                    <span>{course.completedLessons}/{course.totalLessons} {t('courses.lessons')}</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <Link
                                                href={`/courses/${course.id}/learn`}
                                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                                            >
                                                <PlayCircle className="w-4 h-4" />
                                                {course.progress === 100 ? t('dashboard.viewCourse') : t('dashboard.continueCourse')}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Mis Certificados Tab */}
                        {activeTab === 'certificates' && (
                            <div className="space-y-4">
                                {completedCourses.length > 0 ? (
                                    completedCourses.map((course) => (
                                        <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#B70126] to-[#990120] rounded-lg flex items-center justify-center">
                                                    <Award className="w-8 h-8 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{course.title}</h3>
                                                    <p className="text-sm text-slate-500">{t('dashboard.completedOn')} {new Date(course.completedAt!).toLocaleDateString('es-ES')}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={course.certificateId ? `/api/certificate/${course.certificateId}` : '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                            >
                                                <Download className="w-4 h-4" />
                                                {t('dashboard.downloadCertificate')}
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('dashboard.noCertificates')}</h3>
                                        <p className="text-slate-500">{t('dashboard.completeCoursesToGetCertificates')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Logout Tab */}
                        {activeTab === 'logout' && (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('dashboard.logoutConfirmTitle')}</h3>
                                    <p className="text-slate-500 mb-8">{t('dashboard.logoutConfirmMessage')}</p>
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => setActiveTab('profile')}
                                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (typeof window !== 'undefined') {
                                                    import('next-auth/react').then(({ signOut }) => {
                                                        signOut({ callbackUrl: '/login' });
                                                    });
                                                }
                                            }}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                        >
                                            {t('dashboard.yesLogout')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
