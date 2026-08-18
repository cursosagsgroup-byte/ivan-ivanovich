import { Metadata } from 'next';
import { organizationSchema } from '@/lib/seo-utils';

export const metadata: Metadata = {
    title: 'Ivan Ivanovich - Academia de Protección Ejecutiva',
    description: 'Academia de Protección Ejecutiva reconocida entre las 9 mejores del mundo. Cursos certificados de Team Leader y Contravigilancia con instructor de nivel internacional.',
    keywords: [
        'protección ejecutiva',
        'seguridad privada',
        'academia protección',
        'ivan ivanovich',
        'curso protección ejecutiva',
        'team leader',
        'contravigilancia',
    ],
    openGraph: {
        title: 'Ivan Ivanovich - Academia de Protección Ejecutiva',
        description: 'Academia reconocida entre las 9 mejores del mundo',
        type: 'website',
        images: ['/og-image.jpg'],
    },
    alternates: {
        canonical: 'https://ivanivanovich.com',
        languages: {
            es: 'https://ivanivanovich.com',
            en: 'https://ivanivanovich.com/en',
            'x-default': 'https://ivanivanovich.com',
        },
    },
};

export const homeSchema = organizationSchema();
