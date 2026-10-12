import Link from 'next/link';
import Image from 'next/image';
import { Award } from 'lucide-react';
import AddToCartButton from '@/components/cart/AddToCartButton';
import CourseWaitlistButton from '@/components/course/CourseWaitlistButton';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { getLocale } from '@/lib/get-locale';
import { translations } from '@/lib/translations';
import { COSTA_RICA_COURSE_ID } from '@/lib/course-constants';

// Usa <a> para archivos estáticos (.html en /public) y <Link> para rutas de Next.
// Con `disabled` no enlaza: las ediciones terminadas tienen su landing retirada,
// así que la tarjeta se queda como está en vez de llevar a un callejón.
function CourseLink({ href, className, children, disabled }: { href: string; className?: string; children: React.ReactNode; disabled?: boolean }) {
    if (disabled) {
        return <div className={className}>{children}</div>;
    }
    if (href.endsWith('.html')) {
        return <a href={href} className={className}>{children}</a>;
    }
    return <Link href={href} className={className}>{children}</Link>;
}

export default async function CursosOnlinePage() {
    const cookieStore = await cookies();
    const locale = await getLocale();
    const t = translations[locale as 'es' | 'en'];

    // Fetch published courses from database filtered by language
    const courses = await prisma.course.findMany({
        where: {
            published: true,
            language: locale,
        },
        orderBy: [
            // Las ediciones terminadas van al final: siguen visibles como prueba
            // social y anclaje de precio, pero no compiten con lo que sí se vende.
            { soldOut: 'asc' },
            { createdAt: 'desc' },
        ],
    });
    return (
        <div className="bg-white min-h-screen">
            {/* Hero a sangre, como el del blog: la foto cubre todo el fondo y
                una capa negra la oscurece lo justo para que el texto lea. */}
            <div className="relative w-full overflow-hidden bg-[#0B121F]">
                <Image
                    src="/course-hero-image.jpg"
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="subpage-hero relative z-10 mx-auto max-w-[1440px]">
                    <p className="subpage-hero-eyebrow">
                        {t.courses.heroEyebrow}
                    </p>
                    <h1 className="text-6xl font-normal uppercase leading-none text-white lg:text-8xl" style={{ fontFamily: 'var(--font-bebas)' }}>
                        {t.courses.title}
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-100 sm:text-lg">
                        {t.courses.subtitle}
                    </p>
                </div>
            </div>

            {/* Cursos: mismo patrón editorial que los dos cursos del
                inicio — ancho completo (no max-w-[1440px] centrado),
                etiqueta monoespaciada, línea divisoria, foto 16:10 y
                precio/acción al pie. Se repite en filas de dos. */}
            <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 border-t border-gray-200 lg:grid-cols-2">
                    {courses.map((course, index) => {
                        const isLeftCol = index % 2 === 0;
                        const isFirstRow = index < 2;
                        const currency = course.id === COSTA_RICA_COURSE_ID ? 'USD' : 'MXN';

                        const getCourseLink = (title: string, id: string) => {
                            const lowerTitle = title.toLowerCase();
                            if (lowerTitle.includes('curso de contravigilancia en protección ejecutiva') || lowerTitle.includes('curso de contravigilancia en proteccion ejecutiva')) return '/contravigilancias-pres';
                            if (lowerTitle.includes('team leader')) return '/educacion/team-leader';
                            if (lowerTitle.includes('contravigilancia')) return '/educacion/contravigilancia';
                            if (lowerTitle.includes('counter surveillance')) return '/educacion/contravigilancia';
                            if (lowerTitle.includes('libro')) return '/educacion/libro';
                            // Specific match for Costa Rica course
                            if (lowerTitle.includes('costa rica')) return '/proteccion-ejecutiva-costa-rica';
                            // Specific match for Alerta Temprana Mexico
                            if (lowerTitle.includes('alerta temprana')) return '/alerta-temprana-mexico';
                            // Specific match for "Protección Ejecutiva, Operatividad General y Logística Protectiva"
                            // Using a significant substring to ensure it matches the correct course and NOT others like "Contravigilancia..."
                            if (lowerTitle.includes('operatividad general') && lowerTitle.includes('logística')) return '/proteccion-ejecutiva-operatividad-general';
                            // Seminario Online en Vivo → landing HTML estática
                            if (lowerTitle.includes('seminario online')) return '/landings/seminario-proteccion-ejecutiva.html';
                            return `/educacion/cursos-online/${id}`;
                        };

                        const courseLink = getCourseLink(course.title, course.id);

                        return (
                            <div
                                key={course.id}
                                className={[
                                    'flex flex-col px-0 pb-10 lg:pb-12',
                                    isFirstRow ? 'pt-5 lg:pt-6' : 'border-t border-gray-200 pt-8 lg:pt-10',
                                    index === 1 ? 'lg:border-t-0' : '',
                                    isLeftCol ? 'lg:border-r lg:border-gray-200 lg:pr-12' : 'lg:pl-12',
                                ].filter(Boolean).join(' ')}
                            >
                                <div className="mb-5 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                                    <span className="flex min-w-0 gap-6">
                                        <span className="shrink-0 text-gray-400">{t.home.courseKicker}</span>
                                        <CourseLink
                                            href={courseLink}
                                            disabled={course.soldOut}
                                            className="truncate text-[#16171a] hover:text-[#B70126]"
                                        >
                                            {course.title}
                                        </CourseLink>
                                    </span>
                                    <span className="shrink-0 text-gray-400">{String(index + 1).padStart(3, '0')}</span>
                                </div>

                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                                    {course.soldOut && (
                                        <div className="absolute inset-x-0 top-0 z-10 bg-[#B70126] py-2 text-center">
                                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">
                                                {locale === 'es' ? 'Agotado · Edición terminada' : 'Sold out · Past edition'}
                                            </span>
                                        </div>
                                    )}
                                    <CourseLink href={courseLink} disabled={course.soldOut} className="group block h-full w-full">
                                        {course.image ? (
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className={`h-full w-full object-cover transition-transform duration-300 ${course.soldOut ? 'grayscale opacity-70' : 'group-hover:scale-105'}`}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                <Award className="h-16 w-16" />
                                            </div>
                                        )}
                                    </CourseLink>
                                </div>

                                <p className="mb-8 mt-7 max-w-md text-base leading-relaxed text-gray-600 line-clamp-3 lg:text-[17px]">
                                    {course.description}
                                </p>

                                <div className="mt-auto flex items-end justify-between gap-4">
                                    <div>
                                        <span className={`text-2xl font-bold ${course.soldOut ? 'text-gray-400 line-through' : 'text-[#16171a]'}`}>
                                            ${course.price.toFixed(2)}
                                        </span>
                                        <span className="ml-1 text-xs text-gray-500">{currency}</span>
                                    </div>
                                    {course.soldOut ? (
                                        <CourseWaitlistButton courseTitle={course.title} locale={locale as 'es' | 'en'} />
                                    ) : (
                                        <AddToCartButton
                                            course={{
                                                id: course.id,
                                                title: course.title,
                                                price: course.price,
                                                image: course.image || ''
                                            }}
                                            className="px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] hover:bg-[#8f011e]"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Login/Register Section */}
            <div className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-8">
                <div className="rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-200">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold text-black mb-4">
                            {locale === 'es' ? '¿Ya tienes una cuenta?' : 'Already have an account?'}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/mi-cuenta"
                                className="w-full sm:w-auto rounded-md bg-[#B70126] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#D9012D] transition-colors"
                            >
                                {t.auth.login}
                            </Link>
                            <Link
                                href="/mi-cuenta"
                                className="w-full sm:w-auto rounded-md border border-gray-300 px-6 py-2.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
                            >
                                {t.auth.register}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
