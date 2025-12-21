import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export default function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={trendUp ? 'text-green-600' : 'text-red-600'}>
                        {trend}
                    </span>
                    <span className="ml-2 text-slate-500">from last month</span>
                </div>
            )}
        </div>
    );
}
