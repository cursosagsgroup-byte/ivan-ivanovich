'use client';

import { useState, useEffect } from 'react';

interface Course {
    id: string;
    title: string;
}

interface CouponConfig {
    id?: string;
    code: string;
    discountValue: number;
    maxUses: number | null;
    maxUsesPerUser: number | null;
    expiresAt: string | null;
    courseId: string | null;
    discountType?: string;
}

interface CouponFormProps {
    onSuccess: () => void;
    onCancel: () => void;
    initialData?: CouponConfig;
}

export default function CouponForm({ onSuccess, onCancel, initialData }: CouponFormProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [code, setCode] = useState(initialData?.code || '');
    const [discountValue, setDiscountValue] = useState(initialData?.discountValue?.toString() || '');
    const [maxUses, setMaxUses] = useState(initialData?.maxUses?.toString() || '');
    const [maxUsesPerUser, setMaxUsesPerUser] = useState(initialData?.maxUsesPerUser?.toString() || '');

    // Format date for input: 'YYYY-MM-DD'
    const formatDateForInput = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    const [expiresAt, setExpiresAt] = useState(formatDateForInput(initialData?.expiresAt || null));
    const [courseId, setCourseId] = useState(initialData?.courseId || '');

    useEffect(() => {
        // Fetch courses for selection
        fetch('/api/courses')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, []);

    const generateCode = () => {
        const result = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCode(result);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const discountType = 'PERCENTAGE'; // We only support percentage for now as requested
            const couponData = {
                code: code.toUpperCase(),
                discountType,
                discountValue: parseFloat(discountValue),
                maxUses: maxUses ? parseInt(maxUses) : null,
                maxUsesPerUser: maxUsesPerUser ? parseInt(maxUsesPerUser) : null,
                expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
                courseId: courseId === 'all' ? null : courseId
            };

            let res;
            if (initialData?.id) {
                res = await fetch(`/api/coupons/${initialData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(couponData),
                });
            } else {
                res = await fetch('/api/coupons', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(couponData),
                });
            }

            if (!res.ok) {
                const error = await res.json();
                alert(error.error || 'Failed to create coupon');
                return;
            }

            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        required
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="SUMMER2025"
                    />
                    <button
                        type="button"
                        onClick={generateCode}
                        className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
                    >
                        Generate
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage (%)</label>
                <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="20"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Course (Optional)</label>
                <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="">Apply to all courses</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Leave empty to create a global coupon</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses (Total Redemptions)</label>
                    <input
                        type="number"
                        min="1"
                        value={maxUses}
                        onChange={(e) => setMaxUses(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g. 100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses Per User</label>
                    <input
                        type="number"
                        min="1"
                        value={maxUsesPerUser}
                        onChange={(e) => setMaxUsesPerUser(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g. 1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
                    <input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Coupon' : 'Create Coupon')}
                </button>
            </div>
        </form>
    );
}
