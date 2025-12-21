'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import { PasswordInput } from '@/components/ui/PasswordInput';

export default function LoginPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(t('auth.invalidCredentials'));
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            setError(t('auth.errorLogin'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link href="/">
                    <Image
                        className="mx-auto h-12 w-auto"
                        src="/logo.png"
                        alt="Ivan Ivanovich"
                        width={200}
                        height={50}
                    />
                </Link>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900" style={{ fontFamily: 'var(--font-montserrat)' }}>
                    {t('auth.login')}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Hemos actualizado nuestra plataforma.<br />
                                <span className="font-bold">Si es tu primera vez entrando, por favor dale click en "¿Olvidaste tu contraseña?".</span>
                            </p>
                        </div>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            {t('auth.email')}
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B70126] sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                {t('auth.password')}
                            </label>
                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-semibold text-[#B70126] hover:text-red-800">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                        </div>
                        <div className="mt-2">
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-[#B70126] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B70126] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('auth.signingIn') : t('auth.login')}
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
}
