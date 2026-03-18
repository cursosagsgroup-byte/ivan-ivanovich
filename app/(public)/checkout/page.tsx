'use client';

import { useCart } from '@/lib/cart-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Shield, CreditCard, Lock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { PasswordInput } from '@/components/ui/PasswordInput';
import dynamic from 'next/dynamic';
import { signIn, useSession, signOut } from 'next-auth/react';
import { COSTA_RICA_COURSE_ID } from '@/lib/course-constants';

const StripePaymentForm = dynamic(() => import('@/components/stripe/StripePaymentForm'), { ssr: false });
const MercadoPagoPaymentForm = dynamic(() => import('@/components/mercadopago/MercadoPagoPaymentForm'), { ssr: false });

export default function CheckoutPage() {
    const { data: session } = useSession();
    const { items, total, isLoading, clearCart, addToCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const [isProcessing, setIsProcessing] = useState(false);
    // ... skipping unchanged state ...
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        country: '',
        phone: '',
        age: ''
    });
    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Payment state
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [showPayment, setShowPayment] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [orderCurrency, setOrderCurrency] = useState<'MXN' | 'USD'>('MXN');

    // Detectar moneda desde el carrito antes de crear la orden
    useEffect(() => {
        const isUSD = items.some(item => item.courseId === COSTA_RICA_COURSE_ID);
        setOrderCurrency(isUSD ? 'USD' : 'MXN');
    }, [items]);

    const [activeMethods, setActiveMethods] = useState<string[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('stripe');

    useEffect(() => {
        async function fetchMethods() {
            try {
                const res = await fetch('/api/payments/methods');
                const data = await res.json();
                if (data.activeMethods && data.activeMethods.length > 0) {
                    setActiveMethods(data.activeMethods);
                    setSelectedPaymentMethod(data.activeMethods[0]);
                } else {
                    setActiveMethods(['stripe']); // fallback
                }
            } catch (e) {
                console.error('Error', e);
                setActiveMethods(['stripe']);
            }
        }
        fetchMethods();
    }, []);

    const handleApplyCoupon = async (codeToUse?: string) => {
        setCouponError('');
        const code = typeof codeToUse === 'string' ? codeToUse : couponCode;
        if (!code.trim()) return;

        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    cartItems: items,
                    email: formData.email
                })
            });

            const data = await res.json();

            if (data.valid) {
                setDiscount(data.discountAmount);
                setAppliedCoupon(data.coupon.code);
                if (typeof codeToUse !== 'string') setCouponCode('');
            } else {
                setCouponError(data.message || t('checkout.invalidCoupon'));
                setDiscount(0);
                setAppliedCoupon(null);
            }
        } catch (error) {
            console.error('Error validating coupon:', error);
            setCouponError(t('checkout.invalidCoupon'));
        }
    };

    useEffect(() => {
        if (appliedCoupon && formData.email) {
            handleApplyCoupon(appliedCoupon);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.email]);

    useEffect(() => {
        if (!searchParams) return;
        const courseToAdd = searchParams.get('add');
        if (courseToAdd && !isLoading) {
            const alreadyInCart = items.some(item => item.courseId === courseToAdd);
            if (!alreadyInCart) {
                // Fetch course info and add to cart
                fetch(`/api/courses/public/${courseToAdd}`)
                    .then(res => res.json())
                    .then(course => {
                        if (course && !course.error) {
                            addToCart({
                                courseId: course.id,
                                title: course.title,
                                price: course.price,
                                image: course.image || ''
                            });
                        }
                    })
                    .catch(err => console.error('Error auto-adding course:', err));
            }

            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete('add');
            window.history.replaceState({}, '', url.toString());
        }
    }, [searchParams, isLoading, items, addToCart]);

    const handleRemoveCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    useEffect(() => {
        const isAddingCourse = searchParams?.get('add');
        if (!isLoading && items.length === 0 && !isRedirecting && !isAddingCourse) {
            router.push('/educacion/cursos-online');
        }
    }, [items, isLoading, router, isRedirecting, searchParams]);

    useEffect(() => {
        if (session?.user) {
            const names = session.user.name?.split(' ') || ['', ''];
            setFormData(prev => ({
                ...prev,
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: session.user.email || ''
            }));
        }
    }, [session]);

    const handlePaymentSuccess = useCallback(async () => {
        setIsRedirecting(true);
        // Clear cart and redirect
        await clearCart();
        router.push(`/checkout/success?orderId=${orderId}&orderNumber=${orderNumber}`);
    }, [clearCart, router, orderId, orderNumber]);

    const handlePaymentError = useCallback((error: string) => {
        alert(`Error en el pago: ${error}`);
        setShowPayment(false);
    }, []);

    if (items.length === 0 && !isRedirecting) {
        return null;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            if (password !== confirmPassword) {
                alert(t('checkout.passwordsMismatch'));
                return;
            }

            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres');
                return;
            }
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({ courseId: item.courseId })),
                    billingDetails: formData,
                    couponCode: appliedCoupon,
                    paymentMethod: selectedPaymentMethod,
                    verificationToken: 'no-verification-required',
                    password: session ? undefined : password,
                    country: formData.country,
                    phone: formData.phone,
                    age: parseInt(formData.age),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }


            // Order created
            // Check if it's a free order (100% discount)
            if (data.freeOrder) {
                setIsRedirecting(true);

                // Auto-login only if not already logged in
                if (!session && password) {
                    try {
                        const result = await signIn('credentials', {
                            redirect: false,
                            email: formData.email,
                            password: password
                        });

                        if (result?.error) {
                            console.error('Auto-login failed:', result.error);
                        }
                    } catch (loginError) {
                        console.error('Auto-login error:', loginError);
                    }
                }

                await clearCart();
                router.push(`/checkout/success?orderId=${data.orderId}&orderNumber=${data.orderNumber}`);
                return;
            }

            // Normal flow: show payment form
            setOrderId(data.orderId);
            setOrderNumber(data.orderNumber);
            setPaymentAmount(data.total); // Enable using authoritative total
            setOrderCurrency(data.currency || 'MXN'); // Capture currency from response
            setShowPayment(true);

        } catch (error) {
            console.error('Checkout error:', error);
            alert(t('checkout.errorProcessing'));
            setIsRedirecting(false);
        } finally {
            setIsProcessing(false);
        }
    };



    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-16 checkout-page-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t('checkout.title')}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-slate-600">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">{t('checkout.securePayment')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Checkout Form */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-primary" />
                                {t('checkout.personalInfo')}
                            </h2>
                            <form id="checkout-form" onSubmit={handleCreateOrder} className="space-y-4">
                                {session?.user && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {session.user.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">Comprando como</p>
                                                <p className="text-sm text-slate-600">{session.user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => signOut()}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                                        >
                                            Cambiar cuenta
                                        </button>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.firstName')}</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.lastName')}</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.email')}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={!!session}
                                        placeholder="ejemplo@correo.com"
                                        className={`w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 ${session ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
                                    />
                                    {!!session && (
                                        <p className="text-xs text-slate-500 mt-1">El correo no se puede cambiar porque has iniciado sesión.</p>
                                    )}
                                </div>

                                {/* New Personal Info Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.country')}</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                                        >
                                            <option value="">Selecciona tu país</option>
                                            <option value="México">🇲🇽 México</option>
                                            <option value="Estados Unidos">🇺🇸 Estados Unidos</option>
                                            <option value="España">🇪🇸 España</option>
                                            <option value="Colombia">🇨🇴 Colombia</option>
                                            <option value="Argentina">🇦🇷 Argentina</option>
                                            <option value="Chile">🇨🇱 Chile</option>
                                            <option value="Perú">🇵🇪 Perú</option>
                                            <option value="Venezuela">🇻🇪 Venezuela</option>
                                            <option value="Ecuador">🇪🇨 Ecuador</option>
                                            <option value="Guatemala">🇬🇹 Guatemala</option>
                                            <option value="Costa Rica">🇨🇷 Costa Rica</option>
                                            <option value="Panamá">🇵🇦 Panamá</option>
                                            <option value="Uruguay">🇺🇾 Uruguay</option>
                                            <option value="Paraguay">🇵🇾 Paraguay</option>
                                            <option value="Bolivia">🇧🇴 Bolivia</option>
                                            <option value="República Dominicana">🇩🇴 República Dominicana</option>
                                            <option value="Puerto Rico">🇵🇷 Puerto Rico</option>
                                            <option value="El Salvador">🇸🇻 El Salvador</option>
                                            <option value="Honduras">🇭🇳 Honduras</option>
                                            <option value="Nicaragua">🇳🇮 Nicaragua</option>
                                            <option value="Otro">🌎 Otro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp (Obligatorio)</label>
                                        <div className="flex gap-1">
                                            <input
                                                type="text"
                                                value={(() => {
                                                    const prefixes: Record<string, string> = {
                                                        'México': '+52', 'Estados Unidos': '+1', 'España': '+34',
                                                        'Colombia': '+57', 'Argentina': '+54', 'Chile': '+56',
                                                        'Perú': '+51', 'Venezuela': '+58', 'Ecuador': '+593',
                                                        'Guatemala': '+502', 'Costa Rica': '+506', 'Panamá': '+507',
                                                        'Uruguay': '+598', 'Paraguay': '+595', 'Bolivia': '+591',
                                                        'República Dominicana': '+1-809', 'Puerto Rico': '+1-787',
                                                        'El Salvador': '+503', 'Honduras': '+504', 'Nicaragua': '+505',
                                                    };
                                                    return prefixes[formData.country] || '+';
                                                })()}
                                                disabled
                                                className="w-12 px-1 py-2 rounded-lg border border-slate-300 bg-slate-100 text-slate-600 text-center font-mono text-sm"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="555 123 4567"
                                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Solo números, sin prefijo de país</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.age')}</label>
                                        <select
                                            name="age"
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                                        >
                                            <option value="">Selecciona tu edad</option>
                                            {Array.from({ length: 65 }, (_, i) => i + 18).map(age => (
                                                <option key={age} value={age}>{age} años</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Password Creation */}
                                {!session && (
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-900">{t('checkout.createPassword')}</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.password')}</label>
                                            <PasswordInput
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('checkout.confirmPassword')}</label>
                                            <PasswordInput
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-32">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('checkout.orderSummary')}</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.image && (
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{item.title}</h3>
                                            <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">{t('checkout.couponLabel')}</label>
                                {appliedCoupon ? (
                                    <div className="flex justify-between items-center bg-green-50 border border-green-200 p-3 rounded-lg">
                                        <span className="text-green-700 font-medium flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            {appliedCoupon} {t('checkout.couponApplied')}
                                        </span>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            {t('checkout.remove')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder={t('checkout.couponPlaceholder')}
                                            className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-slate-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleApplyCoupon()}
                                            disabled={!couponCode}
                                            className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {t('checkout.apply')}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
                            </div>

                            <div className="border-t border-slate-200 pt-4 space-y-2 mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>{t('checkout.subtotal')}</span>
                                    <span>{orderCurrency === 'USD' ? 'USD' : ''} ${total.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>{t('checkout.discount')}</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                )}
                                {orderCurrency !== 'USD' && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>IVA (16%)</span>
                                        <span>${((total - discount) * 0.16).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-2 mt-2">
                                    <span>{t('checkout.total')}</span>
                                    <span>
                                        {orderCurrency === 'USD'
                                            ? `USD $${(total - discount).toFixed(2)}`
                                            : `$${((total - discount) * 1.16).toFixed(2)}`
                                        }
                                    </span>
                                </div>
                                {orderCurrency === 'USD' && (
                                    <p className="text-xs text-slate-500 mt-1">💵 Este curso se cobra en dólares estadounidenses (USD), sin IVA.</p>
                                )}
                            </div>

                            <div className="border-t border-slate-200 pt-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    {t('checkout.paymentMethod')}
                                </h3>

                                <div className="space-y-3 mb-6">
                                    {activeMethods.includes('stripe') && (
                                        <div
                                            className={`border-2 rounded-xl overflow-hidden transition-colors ${selectedPaymentMethod === 'stripe' ? 'border-primary' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <div
                                                onClick={() => {
                                                    setSelectedPaymentMethod('stripe');
                                                    if (showPayment && selectedPaymentMethod !== 'stripe') {
                                                        setShowPayment(false);
                                                    }
                                                }}
                                                className={`p-4 flex items-center justify-between cursor-pointer ${selectedPaymentMethod === 'stripe' ? 'bg-red-50' : ''}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-4 h-4 rounded-full border-4 shadow-sm ring-1 ${selectedPaymentMethod === 'stripe' ? 'bg-primary border-white ring-primary' : 'bg-transparent border-white ring-slate-300'}`}></div>
                                                    <span className="font-medium text-slate-900">{t('checkout.creditCard')} (Stripe)</span>
                                                </div>
                                            </div>
                                            {selectedPaymentMethod === 'stripe' && showPayment && orderId && (
                                                <div className="p-4 bg-white border-t border-slate-100">
                                                    <StripePaymentForm
                                                        amount={paymentAmount || (total - discount)}
                                                        orderId={orderId}
                                                        onSuccess={handlePaymentSuccess}
                                                        onError={handlePaymentError}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeMethods.includes('mercadopago') && (
                                        <div
                                            className={`border-2 rounded-xl overflow-hidden transition-colors ${selectedPaymentMethod === 'mercadopago' ? 'border-[#009EE3]' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            <div
                                                onClick={() => {
                                                    setSelectedPaymentMethod('mercadopago');
                                                    if (showPayment && selectedPaymentMethod !== 'mercadopago') {
                                                        setShowPayment(false);
                                                    }
                                                }}
                                                className={`p-4 flex items-center justify-between cursor-pointer ${selectedPaymentMethod === 'mercadopago' ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-4 h-4 rounded-full border-4 shadow-sm ring-1 ${selectedPaymentMethod === 'mercadopago' ? 'bg-[#009EE3] border-white ring-[#009EE3]' : 'bg-transparent border-white ring-slate-300'}`}></div>
                                                    <span className="font-medium text-slate-900">Mercado Pago</span>
                                                </div>
                                                <div className="flex gap-2 text-xl">
                                                    <span className="font-bold text-[#009EE3]">mercado</span>
                                                    <span className="font-bold text-[#1f2937]">pago</span>
                                                </div>
                                            </div>
                                            {selectedPaymentMethod === 'mercadopago' && showPayment && orderId && (
                                                <div className="p-4 bg-white border-t border-slate-100">
                                                    <MercadoPagoPaymentForm
                                                        amount={paymentAmount || (total - discount)}
                                                        orderId={orderId}
                                                        onSuccess={handlePaymentSuccess}
                                                        onError={handlePaymentError}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {!showPayment && (
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={isProcessing}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-[#D9012D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? t('checkout.processing') : 'Continuar al Pago'}
                                    </button>
                                )}
                            </div>

                            <p className="text-xs text-center text-slate-500 mt-4">
                                {t('checkout.terms')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
