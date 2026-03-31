import { Metadata } from 'next'
import { generateMetadata, courseSchema } from '@/lib/seo-utils'

export const metadata: Metadata = generateMetadata({
    title: 'Counter Surveillance for Executive Protection',
    description: 'Expert Counter Surveillance course for Executive Protection professionals. Learn to detect and neutralize threats with international instructor Ivan Ivanovich.',
    keywords: [
        'counter surveillance',
        'executive protection',
        'surveillance detection',
        'security training',
        'ivan ivanovich',
        'protection academy',
    ],
    image: '/curso-contravigilancia.jpg',
    url: '/educacion/counter-surveillance',
    type: 'website',
})

export const teamLeaderSchemaEN = courseSchema({
    name: 'Team Leader in Executive Protection',
    description:
        'Complete course to lead executive protection teams with professional techniques and international certification.',
    image: 'https://ivanivanovich.com/curso-team-leader.png',
    price: 1900,
    currency: 'MXN',
})
