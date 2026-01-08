import DatabaseTab from "@/components/admin/DatabaseTab";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function DatabasePage() {
    return (
        <div className="space-y-6">
            <DatabaseTab />
        </div>
    );
}
