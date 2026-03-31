import { Metadata } from 'next'
import { generateMetadata, courseSchema } from '@/lib/seo-utils'

export const metadata: Metadata = generateMetadata({
    title: 'Team Leader in Executive Protection',
    description: 'Elite professional Team Leader training in Executive Protection. Learn to lead high-performance security teams with international instructor Ivan Ivanovich.',
    keywords: [
        'team leader',
        'executive protection',
        'security team leadership',
        'high performance security',
        'ivan ivanovich',
        'protection academy',
    ],
    image: '/curso-team-leader.png',
    url: '/educacion/team-leader',
    type: 'website',
})

export const teamLeaderSchema = courseSchema({
    name: 'Team Leader in Executive Protection',
    description:
        'Advanced course for leading executive protection teams with professional techniques and international certification.',
    image: 'https://ivanivanovich.com/curso-team-leader.png',
    price: 1900,
    currency: 'MXN',
})
