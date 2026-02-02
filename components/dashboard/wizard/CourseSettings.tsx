'use client';

import { useState, useRef } from 'react';
import { Upload, Type, Move, Image as ImageIcon, X } from 'lucide-react';

interface OverlayPosition {
    x: number;
    y: number;
    fontSize: number;
    color: string;
    show: boolean;
}

interface CertificateSettings {
    studentName: OverlayPosition;
    completionDate: OverlayPosition;
    courseName: OverlayPosition;
}

export default function CourseSettings() {
    const [settings, setSettings] = useState({
        price: 0,
        isPublic: false,
        certificate: true,
        duration: '',
    });

    const [certificateImage, setCertificateImage] = useState<string | null>(null);
    const [overlaySettings, setOverlaySettings] = useState<CertificateSettings>({
        studentName: { x: 50, y: 50, fontSize: 24, color: '#000000', show: true },
        completionDate: { x: 50, y: 70, fontSize: 16, color: '#000000', show: true },
        courseName: { x: 50, y: 30, fontSize: 32, color: '#000000', show: true },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificateImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const updateOverlay = (key: keyof CertificateSettings, field: keyof OverlayPosition, value: any) => {
        setOverlaySettings(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Course Settings</h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                            Price (MXN)
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                min="0"
                                value={settings.price}
                                onChange={handleChange}
                                className="block w-full rounded-md border-slate-300 pl-7 focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-slate-700">
                            Total Duration (approx.)
                        </label>
                        <input
                            type="text"
                            name="duration"
                            id="duration"
                            value={settings.duration}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border"
                            placeholder="e.g. 10 hours"
                        />
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="isPublic"
                                name="isPublic"
                                type="checkbox"
                                checked={settings.isPublic}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isPublic" className="font-medium text-slate-700">
                                Make Public
                            </label>
                            <p className="text-slate-500">Allow students to see and purchase this course.</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="certificate"
                                name="certificate"
                                type="checkbox"
                                checked={settings.certificate}
                                onChange={handleChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="certificate" className="font-medium text-slate-700">
                                Enable Certificate
                            </label>
                            <p className="text-slate-500">Award a certificate upon course completion.</p>
                        </div>
                    </div>

                    {/* Certificate Builder */}
                    {settings.certificate && (
                        <div className="mt-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
                            <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" /> Certificate Builder
                            </h3>

                            <div className="mb-6">
                                <div className="flex gap-4 mb-4">
                                    <button
                                        onClick={() => {
                                            setCertificateImage(null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${!certificateImage ? 'bg-slate-200 text-slate-800' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
                                    >
                                        Upload Custom
                                    </button>
                                    <button
                                        onClick={() => setCertificateImage('/certificate_template_gold_black.png')}
                                        className="px-4 py-2 text-sm font-medium bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
                                    >
                                        Use Templates
                                    </button>
                                </div>

                                {!certificateImage ? (
                                    <div className="space-y-4">
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-white transition-colors"
                                        >
                                            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-600 font-medium">Upload Certificate Background</p>
                                            <p className="text-xs text-slate-400 mt-1">Recommended size: 1920x1080px (Landscape)</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-slate-700 mb-2">Or choose a template:</p>
                                            <div className="grid grid-cols-3 gap-4">
                                                {[
                                                    { name: 'Gold & Black', src: '/certificate_template_gold_black.png' },
                                                    { name: 'Minimalist', src: '/certificate_template_minimalist.png' },
                                                    { name: 'Classic Blue', src: '/certificate_template_classic_blue.png' }
                                                ].map((template) => (
                                                    <div
                                                        key={template.name}
                                                        onClick={() => setCertificateImage(template.src)}
                                                        className="cursor-pointer group relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-all"
                                                    >
                                                        <img src={template.src} alt={template.name} className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Select</span>
                                                        </div>
                                                        <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center truncate">
                                                            {template.name}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Preview Area */}
                                        <div className="relative w-full aspect-video bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
                                            <img src={certificateImage} alt="Certificate Background" className="w-full h-full object-cover" />

                                            {/* Overlays */}
                                            {Object.entries(overlaySettings).map(([key, config]) => (
                                                config.show && (
                                                    <div
                                                        key={key}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${config.x}%`,
                                                            top: `${config.y}%`,
                                                            transform: 'translate(-50%, -50%)',
                                                            fontSize: `${config.fontSize}px`, // This is relative, might need scaling logic for real PDF
                                                            color: config.color,
                                                            fontWeight: 'bold',
                                                            whiteSpace: 'nowrap',
                                                            pointerEvents: 'none' // Just for preview
                                                        }}
                                                    >
                                                        {key === 'studentName' ? 'Student Name' :
                                                            key === 'courseName' ? 'Course Title' :
                                                                'DD/MM/YYYY'}
                                                    </div>
                                                )
                                            ))}

                                            <button
                                                onClick={() => setCertificateImage(null)}
                                                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-600 shadow-sm"
                                                title="Change Background"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Controls */}
                                        <div className="grid grid-cols-1 gap-4">
                                            {Object.entries(overlaySettings).map(([key, config]) => (
                                                <div key={key} className="bg-white p-4 rounded-md border border-slate-200">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Type className="h-4 w-4 text-slate-400" />
                                                            <span className="font-medium text-slate-700 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                checked={config.show}
                                                                onChange={(e) => updateOverlay(key as keyof CertificateSettings, 'show', e.target.checked)}
                                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                            />
                                                        </div>
                                                    </div>

                                                    {config.show && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Position X (%)</label>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    value={config.x}
                                                                    onChange={(e) => updateOverlay(key as keyof CertificateSettings, 'x', parseInt(e.target.value))}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Position Y (%)</label>
                                                                <input
                                                                    type="range"
                                                                    min="0"
                                                                    max="100"
                                                                    value={config.y}
                                                                    onChange={(e) => updateOverlay(key as keyof CertificateSettings, 'y', parseInt(e.target.value))}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Font Size</label>
                                                                <input
                                                                    type="number"
                                                                    value={config.fontSize}
                                                                    onChange={(e) => updateOverlay(key as keyof CertificateSettings, 'fontSize', parseInt(e.target.value))}
                                                                    className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary text-xs px-2 py-1 border"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-slate-500 mb-1">Color</label>
                                                                <input
                                                                    type="color"
                                                                    value={config.color}
                                                                    onChange={(e) => updateOverlay(key as keyof CertificateSettings, 'color', e.target.value)}
                                                                    className="w-full h-8 rounded-md border border-slate-300 cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
