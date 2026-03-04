
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
    const [mode, setMode] = useState<'email' | 'whatsapp'>('email');
    const [email, setEmail] = useState('');
    const [phonePrefix, setPhonePrefix] = useState('52');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const identifier = mode === 'email' ? email : phonePrefix + phoneNumber.replace(/\D/g, '');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier }),
            });

            if (res.ok) {
                setMessage(
                    mode === 'email'
                        ? 'Si el correo está registrado, recibirás un enlace en tu bandeja (revisa también Spam).'
                        : 'Si el número está registrado, recibirás un mensaje de WhatsApp con el enlace para restablecer tu contraseña.'
                );
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
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {/* Toggle Tabs */}
                <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
                    <button
                        type="button"
                        onClick={() => { setMode('email'); setMessage(''); setError(''); }}
                        className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === 'email' ? 'bg-[#B70126] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        ✉️ Por Correo
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('whatsapp'); setMessage(''); setError(''); }}
                        className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        📱 Por WhatsApp
                    </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {mode === 'email' ? (
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Correo Electrónico
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
                                    placeholder="usuario@correo.com"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#B70126] sm:text-sm sm:leading-6 px-3"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                Número de WhatsApp
                            </label>
                            <div className="mt-2 flex gap-2">
                                <select
                                    value={phonePrefix}
                                    onChange={(e) => setPhonePrefix(e.target.value)}
                                    className="px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#25D366] text-sm bg-white shadow-sm"
                                >
                                    <option value="52">🇲🇽 +52</option>
                                    <option value="1">🇺🇸 +1</option>
                                    <option value="54">🇦🇷 +54</option>
                                    <option value="57">🇨🇴 +57</option>
                                    <option value="56">🇨🇱 +56</option>
                                    <option value="51">🇵🇪 +51</option>
                                    <option value="593">🇪🇨 +593</option>
                                    <option value="598">🇺🇾 +598</option>
                                    <option value="595">🇵🇾 +595</option>
                                    <option value="591">🇧🇴 +591</option>
                                    <option value="502">🇬🇹 +502</option>
                                    <option value="503">🇸🇻 +503</option>
                                    <option value="504">🇭🇳 +504</option>
                                    <option value="505">🇳🇮 +505</option>
                                    <option value="506">🇨🇷 +506</option>
                                    <option value="507">🇵🇦 +507</option>
                                    <option value="53">🇨🇺 +53</option>
                                    <option value="34">🇪🇸 +34</option>
                                    <option value="1787">🇵🇷 +1787</option>
                                    <option value="1809">🇩🇴 +1809</option>
                                    <option value="58">🇻🇪 +58</option>
                                </select>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="5543830150"
                                    className="flex-1 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#25D366] sm:text-sm sm:leading-6 px-3"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">
                                Selecciona tu país e ingresa el número <strong>sin el prefijo</strong>. Debe coincidir con el número en tu perfil.
                            </p>
                        </div>
                    )}

                    {message && (
                        <div className="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${mode === 'whatsapp'
                                    ? 'bg-[#25D366] hover:bg-[#1da851]'
                                    : 'bg-[#B70126] hover:bg-red-800'
                                }`}
                        >
                            {loading ? 'Enviando...' : mode === 'whatsapp' ? 'Enviar por WhatsApp' : 'Enviar enlace por correo'}
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
