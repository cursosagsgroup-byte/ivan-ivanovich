'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { RefreshCw, CheckCircle, Smartphone, Key } from 'lucide-react';

export default function WhatsAppPage() {
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);

    // Pairing Code State
    const [showPairing, setShowPairing] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pairingCode, setPairingCode] = useState<string | null>(null);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/admin/whatsapp/status');
            const data = await res.json();

            setConnected(data.connected);

            if (data.qr) {
                // Convert QR string to Data URL
                QRCode.toDataURL(data.qr, (err, url) => {
                    if (!err) setQrCodeData(url);
                });
            } else {
                setQrCodeData(null);
            }
        } catch (error) {
            console.error('Error fetching WA status:', error);
        } finally {
            // Only stop initial loading. 
            // If we are showing pairing UI, we manage loading state manually there.
            if (!showPairing && !pairingCode) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        if (!confirm('¿Seguro que quieres desconectar el bot? Tendrás que escanear de nuevo.')) return;
        setLoading(true);
        try {
            await fetch('/api/admin/whatsapp/logout', { method: 'POST' });
            setConnected(false);
            setQrCodeData(null);
            setPairingCode(null);
            setShowPairing(false);
            setTimeout(fetchStatus, 2000); // Wait for restart
        } catch (error) {
            console.error(error);
        }
    };

    const handlePairing = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/admin/whatsapp/pair', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber })
            });
            const data = await res.json();
            if (data.success) {
                setPairingCode(data.code);
            } else {
                alert('Error: ' + data.error);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error al solicitar código');
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bot de WhatsApp</h1>
            <p className="text-slate-500 mb-8">Conecta tu número para que la IA responda automáticamente.</p>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8 flex flex-col items-center justify-center min-h-[400px]">

                {loading && !pairingCode && !showPairing ? (
                    <div className="flex flex-col items-center">
                        <Smartphone className="h-16 w-16 mb-4 opacity-50 animate-pulse" />
                        <p>Conectando...</p>

                        <div className="flex gap-4 mt-4 mb-6">
                            <button onClick={fetchStatus} className="text-primary hover:underline flex items-center gap-1">
                                <RefreshCw className="h-4 w-4" />
                            </button>
                            <button onClick={handleLogout} className="text-red-500 hover:underline flex items-center gap-1">
                                🛑 Resetear
                            </button>
                        </div>

                        <button
                            onClick={() => setShowPairing(true)}
                            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500"
                        >
                            <Key className="h-4 w-4" />
                            ¿No carga? Entrar con Número
                        </button>
                    </div>
                ) : connected ? (
                    <div className="flex flex-col items-center text-green-600 animate-in fade-in zoom-in duration-300">
                        <CheckCircle className="h-24 w-24 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">¡Conectado!</h2>
                        <p className="text-slate-600 text-center mb-6">
                            Tu WhatsApp está vinculado y funcionando. <br />
                            La IA responderá a los mensajes entrantes.
                        </p>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                        >
                            Desconectar / Resetear
                        </button>
                    </div>
                ) : pairingCode ? (
                    <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Código de Vinculación</h2>
                        <div className="bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 mb-6 relative group">
                            <span className="text-5xl font-mono font-bold tracking-widest text-slate-800 select-all">
                                {pairingCode?.split('').join(' ')}
                            </span>
                            <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm transform rotate-12">
                                ¡Nuevo!
                            </div>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r text-left w-full max-w-md">
                            <h3 className="font-bold text-blue-900">⚠️ MUY IMPORTANTE:</h3>
                            <p className="text-blue-800 text-sm">
                                Este código <strong>NO te llegará por mensaje</strong>. <br />
                                <span className="underline decoration-blue-500 decoration-2 font-bold">TÚ DEBES ESCRIBIRLO</span> en WhatsApp ahora mismo.
                            </p>
                        </div>
                        <ol className="text-left text-slate-600 space-y-3 list-decimal list-inside bg-slate-50 p-6 rounded-lg max-w-md shadow-inner border border-slate-100">
                            <li>Abre <strong>WhatsApp</strong> en tu teléfono.</li>
                            <li>Ve a <strong>Dispositivos vinculados</strong>.</li>
                            <li>Toca en <strong>Vincular un dispositivo</strong>.</li>
                            <li>Selecciona <strong>"Vincular con el número de teléfono"</strong> (opción inferior).</li>
                            <li>Ingresa el código que ves en pantalla.</li>
                        </ol>
                        <button
                            onClick={() => setPairingCode(null)}
                            className="mt-8 text-slate-400 hover:text-red-500 text-sm underline transition-colors"
                        >
                            Cancelar / Volver
                        </button>
                    </div>
                ) : showPairing ? (
                    <div className="w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 mb-4">
                                <Key className="h-6 w-6" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Ingresa tu Número</h2>
                            <p className="text-slate-500 text-sm mt-1">Te daremos un código para ingresar en tu WhatsApp.</p>
                        </div>

                        <form onSubmit={handlePairing} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Número de Teléfono (con código de país)</label>
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9+]/g, ''))}
                                    placeholder="Ej: +52 1 55..."
                                    className="w-full p-4 text-lg tracking-wide border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-900 bg-white"
                                    required
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    * Incluye código de país (ej. 52 para México). No uses espacios ni guiones.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading && pairingCode === null}
                                className="w-full py-4 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? 'Solicitando...' : 'Obtener Código'}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowPairing(false); setLoading(false); }}
                                className="w-full py-2 text-slate-500 hover:text-slate-800 text-sm"
                            >
                                Cancelar
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {qrCodeData ? (
                            <div className="flex flex-col items-center animate-in fade-in duration-500">
                                <div className="bg-white p-4 border-2 border-slate-900 rounded-xl mb-6 shadow-xl relative group">
                                    <img src={qrCodeData} alt="WhatsApp QR Code" className="w-64 h-64" />

                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-center p-4 border-2 border-slate-100 rounded-lg" onClick={() => setShowPairing(true)}>
                                        <Key className="h-8 w-8 text-primary mb-2" />
                                        <span className="font-bold text-slate-900 text-lg">¿Problemas?</span>
                                        <span className="text-slate-600 text-sm">Usa el código manual</span>
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Escanea el Código QR</h2>
                                <p className="text-slate-500 mb-6 text-sm max-w-xs text-center">
                                    Abre WhatsApp {'>'} Dispositivos vinculados {'>'} Vincular.
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowPairing(true)}
                                        className="px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors text-sm font-semibold flex items-center gap-2"
                                    >
                                        <Smartphone className="h-4 w-4" /> Entrar con Número
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Fallback if loading is false but no QR (should be covered by top block, but safe to keep)
                            <div className="flex flex-col items-center">
                                <Smartphone className="h-16 w-16 mb-4 opacity-50 animate-pulse" />
                                <p>Conectando...</p>
                                <div className="flex gap-4 mt-4 mb-6">
                                    <button onClick={fetchStatus} className="text-primary hover:underline flex items-center gap-1">
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                    <button onClick={handleLogout} className="text-red-500 hover:underline flex items-center gap-1">
                                        🛑 Resetear
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowPairing(true)}
                                    className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-semibold flex items-center gap-2 shadow-lg"
                                >
                                    <Key className="h-4 w-4" />
                                    ¿No carga? Entrar con Número
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
