import { Metadata } from 'next'
import { generateMetadata, courseSchema } from '@/lib/seo-utils'

export const metadata: Metadata = generateMetadata({
    title: 'Team Leader in Executive Protection',
    description: 'Professional Team Leader course certified by internationally recognized expert. Learn the most advanced executive protection techniques and security team management.',
    keywords: [
        'team leader executive protection',
        'executive protection course',
        'team leader training',
        'security team management',
        'executive protection certification',
        'ivan ivanovich',
        'protection academy',
    ],
    image: '/curso-team-leader.png',
    url: '/en/educacion/team-leader',
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
