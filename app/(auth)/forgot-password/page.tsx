
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier: email }),
            });

            if (res.ok) {
                setMessage('Si los datos coinciden, recibirás un enlace para restablecer tu contraseña por Correo o WhatsApp.');
            } else {
                setError('Hubo un error al procesar tu solicitud.');
            }
        } catch (error) {
            setError('Error de conexión.');
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
                    Recuperar Contraseña
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Ingresa tu correo electrónico para recibir un enlace de recuperación.
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Correo Electrónico o WhatsApp
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ej. usuario@mail.com o 5512345678"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B70126] sm:text-sm sm:leading-6 px-3"
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
                            {loading ? 'Enviando...' : 'Enviar enlace'}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="font-semibold leading-6 text-[#B70126] hover:text-red-800">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
