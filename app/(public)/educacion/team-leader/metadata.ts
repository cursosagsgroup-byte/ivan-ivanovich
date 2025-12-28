import { Metadata } from 'next'
import { generateMetadata, courseSchema } from '@/lib/seo-utils'

export const metadata: Metadata = generateMetadata({
    title: 'Team Leader en Protección Ejecutiva',
    description: 'Curso profesional de Team Leader certificado por experto reconocido internacionalmente. Aprende las técnicas más avanzadas de protección ejecutiva y manejo de equipos de seguridad.',
    keywords: [
        'team leader protección ejecutiva',
        'curso protección ejecutiva',
        'formación team leader',
        'gestión equipos seguridad',
        'protección ejecutiva certificado',
        'ivan ivanov ich',
        'academia protección méxico',
    ],
    image: '/curso-team-leader.png',
    url: '/educacion/team-leader',
    type: 'website',
})

export const teamLeaderSchema = courseSchema({
    name: 'Team Leader en Protección Ejecutiva',
    description:
        'Curso completo para liderar equipos de protección ejecutiva con técnicas profesionales y certificación internacional.',
    image: 'https://ivanivanovich.com/curso-team-leader.png',
    price: 1900,
    currency: 'MXN',
})
