
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { PasswordInput } from '@/components/ui/PasswordInput';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams?.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Token inválido o faltante.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Contraseña actualizada correctamente. Redirigiendo al login...');
                setTimeout(() => {
                    router.push('/login?reset=success');
                }, 3000);
            } else {
                setError(data.error || 'Error al actualizar contraseña.');
            }
        } catch (error) {
            setError('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) return <div className="text-center text-red-600">Enlace inválido.</div>;

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Nueva Contraseña
                </label>
                <div className="mt-2">
                    <PasswordInput
                        id="password"
                        name="password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                    Confirmar Contraseña
                </label>
                <div className="mt-2">
                    <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
            </div>

            {message && (
                <div className="text-green-600 text-sm text-center p-2 bg-green-50 rounded">
                    {message}
                </div>
            )}

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
                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                </button>
            </div>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                    Restablecer Contraseña
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Suspense fallback={<div>Cargando...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
