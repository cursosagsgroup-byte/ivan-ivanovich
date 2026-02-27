'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Save, AlertCircle, CheckCircle, CreditCard, DollarSign, Wallet } from 'lucide-react';

interface PaymentConfig {
    id: string;
    gateway: string;
    enabled: boolean;
    testMode: boolean;
    publicKey?: string;
    secretKey?: string;
    clientId?: string;
    clientSecret?: string;
    webhookSecret?: string;
}

const GATEWAYS = [
    {
        id: 'mercadopago',
        name: 'MercadoPago',
        icon: Wallet,
        fields: [
            { name: 'publicKey', label: 'Public Key', type: 'text' },
            { name: 'secretKey', label: 'Access Token', type: 'password' },
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' },
            { name: 'webhookSecret', label: 'Webhook Secret', type: 'password' }
        ]
    },
    {
        id: 'stripe',
        name: 'Stripe',
        icon: CreditCard,
        fields: [
            { name: 'publicKey', label: 'Publishable Key', type: 'text' },
            { name: 'secretKey', label: 'Secret Key', type: 'password' },
            { name: 'webhookSecret', label: 'Webhook Secret', type: 'password' }

        ]
    },
    {
        id: 'paypal',
        name: 'PayPal',
        icon: DollarSign,
        fields: [
            { name: 'clientId', label: 'Client ID', type: 'text' },
            { name: 'clientSecret', label: 'Client Secret', type: 'password' }
        ]
    }
];

export default function PaymentConfigPage() {
    const [configs, setConfigs] = useState<Record<string, PaymentConfig>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const res = await fetch('/api/admin/payments/config');
            if (!res.ok) throw new Error('Error al cargar configuraciones');
            const data = await res.json();

            const configMap: Record<string, PaymentConfig> = {};
            data.forEach((config: PaymentConfig) => {
                configMap[config.gateway] = config;
            });
            setConfigs(configMap);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar las configuraciones');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (gateway: string, data: Partial<PaymentConfig>) => {
        setSaving(gateway);
        try {
            const res = await fetch('/api/admin/payments/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gateway, ...data }),
            });

            if (!res.ok) throw new Error('Error al guardar');

            const updatedConfig = await res.json();
            setConfigs(prev => ({
                ...prev,
                [gateway]: updatedConfig
            }));

            toast.success(`Configuración de ${gateway} guardada`);
        } catch (error) {
            console.error(error);
            toast.error('Error al guardar la configuración');
        } finally {
            setSaving(null);
        }
    };

    const handleInputChange = (gateway: string, field: string, value: any) => {
        setConfigs(prev => ({
            ...prev,
            [gateway]: {
                ...prev[gateway],
                gateway, // Ensure ID is set
                [field]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <a href="/admin/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </a>
                <h1 className="text-3xl font-bold text-slate-900">Configuración de Pasarelas de Pago</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GATEWAYS.map((gateway) => {
                    const config = configs[gateway.id] || {
                        gateway: gateway.id,
                        enabled: false,
                        testMode: true
                    };
                    const Icon = gateway.icon;

                    return (
                        <div key={gateway.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-slate-800">{gateway.name}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.enabled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {config.enabled ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-sm font-medium text-slate-700">Habilitar Pasarela</label>
                                    <button
                                        onClick={() => handleInputChange(gateway.id, 'enabled', !config.enabled)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${config.enabled ? 'bg-primary' : 'bg-slate-200'
                                            }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.enabled ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        Modo de Prueba
                                        <div className="group relative">
                                            <AlertCircle className="h-4 w-4 text-slate-400 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                Activa esto para usar las credenciales de sandbox/prueba.
                                            </div>
                                        </div>
                                    </label>
                                    <button
                                        onClick={() => handleInputChange(gateway.id, 'testMode', !config.testMode)}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${config.testMode ? 'bg-amber-500' : 'bg-slate-200'
                                            }`}
                                    >
                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.testMode ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {gateway.fields.map((field) => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                value={(config as any)[field.name] || ''}
                                                onChange={(e) => handleInputChange(gateway.id, field.name, e.target.value)}
                                                placeholder={field.type === 'password' ? '••••••••' : ''}
                                                className="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2 px-3 border"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => handleSave(gateway.id, config)}
                                    disabled={saving === gateway.id}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving === gateway.id ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Guardar Cambios
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
