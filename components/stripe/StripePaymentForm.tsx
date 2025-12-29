'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';

interface StripePaymentFormProps {
    amount: number;
    orderId: string;
    onSuccess: () => void;
    onError: (error: string) => void;
}

function PaymentForm({ amount, orderId, onSuccess, onError }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
                },
                redirect: 'if_required',
            });

            if (error) {
                onError(error.message || 'Payment failed');
            } else {
                onSuccess();
            }
        } catch (err: any) {
            onError(err.message || 'Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-[#D9012D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <Lock className="w-5 h-5" />
                {isProcessing ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
            </button>
        </form>
    );
}

export default function StripePaymentForm({ amount, orderId, onSuccess, onError }: StripePaymentFormProps) {
    const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
    const [clientSecret, setClientSecret] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initStripe() {
            try {
                const configRes = await fetch('/api/admin/payments/config');
                const configs = await configRes.json();
                const stripeConfig = configs.find((c: any) => c.gateway === 'stripe');

                if (!stripeConfig || !stripeConfig.publicKey) {
                    throw new Error('Stripe not configured');
                }

                const stripe = loadStripe(stripeConfig.publicKey);
                setStripePromise(stripe);

                const paymentRes = await fetch('/api/stripe/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, orderId }),
                });

                const paymentData = await paymentRes.json();
                if (!paymentRes.ok) throw new Error(paymentData.error);

                setClientSecret(paymentData.clientSecret);
            } catch (error: any) {
                onError(error.message || 'Failed to initialize payment');
            } finally {
                setLoading(false);
            }
        }

        initStripe();
    }, [amount, orderId, onError]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!stripePromise || !clientSecret) {
        return (
            <div className="text-red-600 text-center py-4">
                Error al inicializar el pago. Por favor, recarga la página.
            </div>
        );
    }

    const options: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#E3032D',
            },
        },
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <PaymentForm amount={amount} orderId={orderId} onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
}
