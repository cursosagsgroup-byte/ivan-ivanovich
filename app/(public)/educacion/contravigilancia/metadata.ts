import { Metadata } from 'next'
import { generateMetadata, courseSchema } from '@/lib/seo-utils'

export const metadata: Metadata = generateMetadata({
    title: 'Contravigilancia para Protección Ejecutiva',
    description: 'Aprende técnicas profesionales de contravigilancia para protección ejecutiva. Curso certificado con instructor de nivel internacional reconocido entre los mejores del mundo.',
    keywords: [
        'contravigilancia',
        'curso contravigilancia',
        'protección ejecutiva',
        'detección vigilancia',
        'seguridad ejecutiva',
        'ivan ivanov ich',
        'formación seguridad',
    ],
    image: '/curso-contravigilancia.png',
    url: '/educacion/contravigilancia',
    type: 'website',
})

export const contravigilanciaSchema = courseSchema({
    name: 'Contravigilancia para Protección Ejecutiva',
    description:
        'Domina las técnicas de contravigilancia y detección de amenazas en operaciones de protección ejecutiva.',
    image: 'https://ivanivanovich.com/curso-contravigilancia.png',
    price: 1500,
    currency: 'MXN',
})
