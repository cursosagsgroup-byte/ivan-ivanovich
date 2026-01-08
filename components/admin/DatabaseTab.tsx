'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string | null;
    source: string;
    createdAt: string;
}

interface WhatsAppContact {
    id: string;
    name: string | null;
    phoneNumber: string;
    lastMessage: string | null;
    lastMessageAt: string;
    source: string;
    status: string;
}

interface Student {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    createdAt: string;
    _count: {
        enrollments: number;
    };
}

export default function DatabaseTab() {
    const [activeTab, setActiveTab] = useState<'leads' | 'whatsapp' | 'students'>('students');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/database?t=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error('No autorizado. Por favor inicia sesión nuevamente como Administrador.');
                }
                throw new Error('Error al cargar datos del servidor.');
            }
            const data = await res.json();
            setLeads(data.leads || []);
            setContacts(data.contacts || []);
            setStudents(data.students || []);
            console.log('Datos cargados:', data);
        } catch (error: any) {
            console.error('Error fetching database:', error);
            setError(error.message || 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    const getDataForExport = () => {
        switch (activeTab) {
            case 'students': return students;
            case 'leads': return leads;
            case 'whatsapp': return contacts;
            default: return [];
        }
    };

    const exportToCSV = (data: any[], filename: string) => {
        if (!data.length) return;

        // Flatten data for export if needed
        const flatData = data.map(item => {
            if (activeTab === 'students') {
                return {
                    ...item,
                    enrollments: item._count?.enrollments || 0,
                    _count: undefined // Remove nested object
                };
            }
            return item;
        });

        const headers = Object.keys(flatData[0]).join(',');
        const rows = flatData.map(obj => Object.values(obj).map(val => `"${val}"`).join(','));
        const csv = [headers, ...rows].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
    };

    const currentData = activeTab === 'leads' ? leads : activeTab === 'whatsapp' ? contacts : students;

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Cargando datos...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-white rounded-xl border border-red-200">
                <div className="text-red-600 font-medium mb-2">Error: {error}</div>
                <button
                    onClick={fetchData}
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Base de Datos</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => exportToCSV(getDataForExport(), `keting-${activeTab}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'students'
                            ? 'border-[#B70126] text-[#B70126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Alumnos ({students.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'leads'
                            ? 'border-[#B70126] text-[#B70126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        Leads Web ({leads.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('whatsapp')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'whatsapp'
                            ? 'border-[#B70126] text-[#B70126]'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        WhatsApp ({contacts.length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                {activeTab === 'students' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha Registro</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cursos</th>
                                    </>
                                )}
                                {activeTab === 'leads' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mensaje</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fuente</th>
                                    </>
                                )}
                                {activeTab === 'whatsapp' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Último Mensaje</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Mensaje</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {currentData.map((item: any) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    {activeTab === 'students' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {format(new Date(item.createdAt), 'dd MMM yyyy', { locale: es })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900">{item.name || 'Sin Nombre'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {item.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                    {item._count?.enrollments || 0} cursos
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'leads' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-slate-900">{item.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {item.email}
                                                </div>
                                                {item.phone && (
                                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" /> {item.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600 line-clamp-2" title={item.message}>{item.message}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                                                    {item.source}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                    {activeTab === 'whatsapp' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {format(new Date(item.lastMessageAt), 'dd MMM yyyy, HH:mm', { locale: es })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                                                {item.phoneNumber}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                {item.name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-600 line-clamp-2">{item.lastMessage}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {currentData.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        No hay registros encontrados.
                    </div>
                )}
            </div>
        </div>
    );
}
