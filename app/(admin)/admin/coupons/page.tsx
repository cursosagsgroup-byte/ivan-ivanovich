'use client';

import { useState, useEffect } from 'react';
import CouponForm from '@/components/admin/CouponForm';
import { Plus, Trash, RefreshCw, Edit } from 'lucide-react';
import { format } from 'date-fns';

interface Coupon {
    id: string;
    code: string;
    discountType: string;
    discountValue: number;
    maxUses: number | null;
    maxUsesPerUser: number | null;
    usedCount: number;
    expiresAt: string | null;
    isActive: boolean;
    courseId: string | null;
    course?: {
        title: string;
    };
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons');
            const data = await res.json();

            if (Array.isArray(data)) {
                setCoupons(data);
            } else {
                console.error('Expected array of coupons but got:', data);
                setCoupons([]); // Fallback to empty array
                if (data.error) {
                    console.error('API Error:', data.error);
                }
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
            fetchCoupons();
        } catch (error) {
            console.error('Error deleting coupon:', error);
            alert('Failed to delete coupon');
        }
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/coupons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            fetchCoupons();
        } catch (error) {
            console.error('Error updating coupon:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Coupons</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Create Coupon
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                        <CouponForm
                            onSuccess={() => {
                                setShowForm(false);
                                setEditingCoupon(null);
                                fetchCoupons();
                            }}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingCoupon(null);
                            }}
                            initialData={editingCoupon ? {
                                id: editingCoupon.id,
                                code: editingCoupon.code,
                                discountValue: editingCoupon.discountValue,
                                maxUses: editingCoupon.maxUses,
                                maxUsesPerUser: editingCoupon.maxUsesPerUser,
                                expiresAt: editingCoupon.expiresAt,
                                courseId: editingCoupon.courseId || (editingCoupon.course ? null : 'all'), // simplistic fallback
                                discountType: editingCoupon.discountType
                            } : undefined}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Code</th>
                            <th className="p-4 font-semibold text-gray-600">Discount</th>
                            <th className="p-4 font-semibold text-gray-600">Usage</th>
                            <th className="p-4 font-semibold text-gray-600">Restriction</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Expires</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-gray-50">
                                <td className="p-4 font-mono font-bold text-blue-600">{coupon.code}</td>
                                <td className="p-4">
                                    {coupon.discountType === 'PERCENTAGE'
                                        ? `${coupon.discountValue}%`
                                        : `$${coupon.discountValue}`}
                                </td>
                                <td className="p-4">
                                    {coupon.usedCount} / {coupon.maxUses || '∞'}
                                </td>
                                <td className="p-4 text-sm">
                                    {coupon.course ? (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                            {coupon.course.title.substring(0, 20)}...
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">All Courses</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                                        className={`px-2 py-1 rounded text-xs font-semibold ${coupon.isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {coupon.expiresAt ? format(new Date(coupon.expiresAt), 'MMM d, yyyy') : '-'}
                                </td>
                                <td className="p-4 text-right flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="text-blue-600 hover:text-blue-800 p-2"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                    >
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {coupons.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        No coupons found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
