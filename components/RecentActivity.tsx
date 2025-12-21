import { User, BookOpen, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Activity {
    id: string;
    user: string;
    action: string;
    target: string;
    time: Date;
    type: 'enrollment' | 'completion' | 'purchase';
}

export default function RecentActivity({ activities }: { activities: Activity[] }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'purchase': return { icon: DollarSign, color: 'bg-green-100 text-green-600' };
            case 'completion': return { icon: BookOpen, color: 'bg-blue-100 text-blue-600' };
            default: return { icon: User, color: 'bg-purple-100 text-purple-600' };
        }
    };

    return (
        <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-6 py-4">
                <h3 className="text-lg font-medium text-slate-900">Actividad Reciente</h3>
            </div>
            <div className="divide-y divide-border">
                {activities.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">No hay actividad reciente.</div>
                ) : (
                    activities.map((activity) => {
                        const { icon: Icon, color } = getIcon(activity.type);
                        return (
                            <div key={activity.id} className="flex items-center px-6 py-4">
                                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-slate-900">
                                        <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                                        <span className="font-medium">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
