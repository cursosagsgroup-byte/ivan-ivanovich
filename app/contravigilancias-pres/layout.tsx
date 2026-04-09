import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contravigilancia en Protección Ejecutiva | Ivan Ivanovich Academy',
    description: 'Aprende Contravigilancia en Protección Ejecutiva con Ivan Ivanovich.',
};

export default function ContravigilanciaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
