'use client';

import { useState, useEffect } from 'react';
import CouponForm from '@/components/admin/CouponForm';
import { Plus, Trash, RefreshCw, Edit, Users, Download, X } from 'lucide-react';
import { format } from 'date-fns';

interface CouponUser {
    orderId: string;
    orderNumber: string;
    date: string;
    userId: string;
    name: string | null;
    email: string;
    billingName: string;
    billingEmail: string;
    total: number;
    currency: string;
}

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
    const [showingUsersForCoupon, setShowingUsersForCoupon] = useState<Coupon | null>(null);
    const [couponUsers, setCouponUsers] = useState<CouponUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

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

    const handleShowUsers = async (coupon: Coupon) => {
        setShowingUsersForCoupon(coupon);
        setLoadingUsers(true);
        try {
            const res = await fetch(`/api/coupons/${coupon.id}/users`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setCouponUsers(data);
            } else {
                setCouponUsers([]);
            }
        } catch (error) {
            console.error('Error fetching coupon users:', error);
            setCouponUsers([]);
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleDownloadCSV = () => {
        if (couponUsers.length === 0) return;

        const headers = ['Order Number', 'Date', 'User Name', 'User Email', 'Billing Name', 'Billing Email', 'Total', 'Currency'];
        const rows = couponUsers.map(u => [
            u.orderNumber,
            format(new Date(u.date), 'yyyy-MM-dd HH:mm:ss'),
            `"${u.name || ''}"`,
            u.email,
            `"${u.billingName || ''}"`,
            u.billingEmail,
            u.total.toString(),
            u.currency
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `coupon_${showingUsersForCoupon?.code}_users.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            {showingUsersForCoupon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Users for Coupon: <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">{showingUsersForCoupon.code}</span>
                            </h2>
                            <button onClick={() => setShowingUsersForCoupon(null)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        {loadingUsers ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : couponUsers.length === 0 ? (
                            <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                                No users have completed orders with this coupon yet.
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Download size={18} />
                                        Download CSV
                                    </button>
                                </div>
                                <div className="overflow-auto flex-1 border rounded-lg">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-gray-50 sticky top-0 border-b">
                                            <tr>
                                                <th className="p-3 font-semibold text-gray-600">Date</th>
                                                <th className="p-3 font-semibold text-gray-600">Order</th>
                                                <th className="p-3 font-semibold text-gray-600">User Email</th>
                                                <th className="p-3 font-semibold text-gray-600">Billing Name</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {couponUsers.map((user, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-3">{format(new Date(user.date), 'MMM d, yyyy HH:mm')}</td>
                                                    <td className="p-3 font-mono">{user.orderNumber}</td>
                                                    <td className="p-3">{user.email}</td>
                                                    <td className="p-3">{user.billingName || user.name || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
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
                                        onClick={() => handleShowUsers(coupon)}
                                        className="text-indigo-600 hover:text-indigo-800 p-2"
                                        title="View Users"
                                    >
                                        <Users size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(coupon)}
                                        className="text-blue-600 hover:text-blue-800 p-2"
                                        title="Edit Coupon"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon.id)}
                                        className="text-red-600 hover:text-red-800 p-2"
                                        title="Delete Coupon"
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
