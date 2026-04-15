import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contravigilancia en Protección Ejecutiva | Ivan Ivanovich Academy',
    description: 'Aprende Contravigilancia en Protección Ejecutiva con Ivan Ivanovich.',
    openGraph: {
        title: 'Contravigilancia en Protección Ejecutiva | Ivan Ivanovich Academy',
        description: 'La formación más avanzada en Protección Ejecutiva. Instructor Ivan Ivanovich.',
        images: [
            {
                url: '/og-contravigilancia.jpeg',
                width: 1200,
                height: 630,
                alt: 'Curso de Contravigilancia en Protección Ejecutiva',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contravigilancia en Protección Ejecutiva | Ivan Ivanovich Academy',
        description: 'La formación más avanzada en Protección Ejecutiva. Instructor Ivan Ivanovich.',
        images: ['/og-contravigilancia.jpeg'],
    },
};

export default function ContravigilanciaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
