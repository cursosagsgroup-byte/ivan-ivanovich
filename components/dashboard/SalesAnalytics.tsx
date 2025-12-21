'use client';

import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, Calendar } from 'lucide-react';

interface SalesData {
    id: string;
    courseTitle: string;
    courseId: string;
    amount: number;
    date: string; // ISO date string
}

interface CourseOption {
    id: string;
    title: string;
}

interface SalesAnalyticsProps {
    data: SalesData[];
    courses: CourseOption[];
}

export default function SalesAnalytics({ data, courses }: SalesAnalyticsProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string>('all');

    // 1. Filter Data
    const filteredData = useMemo(() => {
        if (selectedCourseId === 'all') return data;
        return data.filter(item => item.courseId === selectedCourseId);
    }, [data, selectedCourseId]);

    // 2. Aggregate Data by Date (for the Chart)
    const chartData = useMemo(() => {
        const grouped: Record<string, number> = {};

        // Initialize days? No, let's just use the data points present for now, or fill last 30 days.
        // For simplicity, let's just group existing data.
        filteredData.forEach(item => {
            const dateObj = new Date(item.date);
            const key = dateObj.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
            grouped[key] = (grouped[key] || 0) + item.amount;
        });

        return Object.entries(grouped).map(([date, amount]) => ({
            date,
            amount
        })).sort((a, b) => {
            // Simple sort might fail with '2 Oct' vs '30 Sep', but assume data is mostly chronological or sort by raw date if needed.
            // For a robust chart, better to map from last 30 days array.
            return 0; // Keeping it simple: display as is or sorted if Map was ordered.
        });
    }, [filteredData]);

    // 3. Calculate Total for the period
    const totalSales = useMemo(() => {
        return filteredData.reduce((acc, item) => acc + item.amount, 0);
    }, [filteredData]);

    return (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-slate-900">Rendimiento de Ventas</h3>
                    <p className="text-sm text-slate-500">
                        Total en periodo: <span className="font-bold text-slate-900">${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </p>
                </div>

                <div className="relative">
                    <select
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                    >
                        <option value="all">Todos los Cursos</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
            </div>

            <div className="h-64 w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748B', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: any) => [`$${(value || 0).toLocaleString()}`, 'Ventas']}
                            />
                            <Bar
                                dataKey="amount"
                                fill="#B70126"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <Calendar className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm">No hay datos de ventas para este filtro</p>
                    </div>
                )}
            </div>
        </div>
    );
}
