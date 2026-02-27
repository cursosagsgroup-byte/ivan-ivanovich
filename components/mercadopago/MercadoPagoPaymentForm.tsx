'use client';

import { useEffect, useState, useCallback } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

interface MercadoPagoPaymentFormProps {
    amount: number;
    orderId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
}

export default function MercadoPagoPaymentForm({ amount, orderId, onSuccess, onError }: MercadoPagoPaymentFormProps) {
    const [isReady, setIsReady] = useState(false);
    const [loadingConfig, setLoadingConfig] = useState(true);
    const [publicKey, setPublicKey] = useState<string | null>(null);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const res = await fetch('/api/mercadopago/config');
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'No se pudo cargar la configuración de Mercado Pago');
                }

                setPublicKey(data.publicKey);
                initMercadoPago(data.publicKey, { locale: 'es-MX' });
            } catch (err: any) {
                onError(err.message || 'Error al conectar con Mercado Pago');
            } finally {
                setLoadingConfig(false);
            }
        }
        fetchConfig();
    }, [onError]);

    const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const res = await fetch('/api/mercadopago/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                        formData
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Error procesando el pago');
                }

                resolve();

                if (data.status === 'approved') {
                    onSuccess();
                } else if (data.status === 'in_process' || data.status === 'pending') {
                    // Si está pendiente también llamamos éxito y el Webhook se encarga luego
                    onSuccess();
                } else {
                    onError('El pago fue rechazado. Inténtalo de nuevo.');
                }
            } catch (error: any) {
                console.error(error);
                reject();
                onError(error.message || 'Error procesando el pago.');
            }
        });
    };

    const onErrorBrick = async (error: any) => {
        console.error('Brick Error:', error);
        onError('Error en el formulario de tarjeta');
    };

    const onReady = async () => {
        setIsReady(true);
    };

    if (loadingConfig) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#009EE3]"></div>
            </div>
        );
    }

    if (!publicKey) {
        return (
            <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
                No se pudo cargar el formulario de pago. Por favor recarga la página.
            </div>
        );
    }

    return (
        <div className="mercadopago-container relative min-h-[300px]">
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#009EE3]"></div>
                </div>
            )}

            <Payment
                initialization={{ amount: amount }}
                customization={{
                    paymentMethods: {
                        creditCard: 'all',
                        debitCard: 'all',
                        ticket: 'all',
                        bankTransfer: 'all',
                    },
                    visual: {
                        style: {
                            theme: 'default',
                            customVariables: {
                                textPrimaryColor: '#0f172a',
                                baseColor: '#E3032D',
                            }
                        }
                    }
                }}
                onSubmit={onSubmit}
                onReady={onReady}
                onError={onErrorBrick}
            />
        </div>
    );
}
