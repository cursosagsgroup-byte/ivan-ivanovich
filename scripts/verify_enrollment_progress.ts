import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- VERIFYING ENROLLMENT DATA INTEGRITY ---\n');

    // 1. Check enrollments with progress
    const enrollmentsWithProgress = await prisma.enrollment.findMany({
        where: {
            progress: {
                gt: 0
            }
        },
        select: {
            id: true,
            progress: true,
            user: { select: { email: true } },
            course: { select: { title: true } }
        },
        take: 10
    });

    console.log(`Enrollments with progress > 0: ${enrollmentsWithProgress.length}`);
    if (enrollmentsWithProgress.length > 0) {
        console.log('Sample:', enrollmentsWithProgress.slice(0, 3));
    }

    // 2. Check enrollments with 0 progress but have LessonProgress
    const enrollmentsZeroButHaveProgress = await prisma.enrollment.findMany({
        where: {
            progress: 0,
            user: {
                lessonProgress: {
                    some: {}
                }
            }
        },
        select: {
            id: true,
            userId: true,
            courseId: true,
            user: {
                select: {
                    email: true,
                    _count: {
                        select: {
                            lessonProgress: true
                        }
                    }
                }
            }
        },
        take: 10
    });

    console.log(`\nEnrollments with progress=0 but user HAS lesson progress: ${enrollmentsZeroButHaveProgress.length}`);
    if (enrollmentsZeroButHaveProgress.length > 0) {
        console.log('Sample:', enrollmentsZeroButHaveProgress.slice(0, 3));
    }

    // 3. Check certificates
    const totalCertificates = await prisma.certificate.count();
    const certificatesWithEnrollment = await prisma.certificate.count({
        where: {
            user: {
                enrollments: {
                    some: {
                        courseId: {
                            // This checks if user has enrollment for the same course
                        }
                    }
                }
            }
        }
    });

    console.log(`\nTotal Certificates: ${totalCertificates}`);
    console.log(`Certificates with matching enrollment: ${certificatesWithEnrollment}`);

    // 4. Users with certificates but enrollment has progress < 100
    const certificatesButNotComplete = await prisma.certificate.findMany({
        where: {
            user: {
                enrollments: {
                    some: {
                        courseId: {
                            // equals the certificate course
                        },
                        progress: {
                            lt: 100
                        }
                    }
                }
            }
        },
        select: {
            id: true,
            user: {
                select: {
                    email: true,
                    enrollments: {
                        select: {
                            progress: true,
                            course: { select: { title: true } }
                        }
                    }
                }
            }
        },
        take: 5
    });

    console.log(`\nCertificates where enrollment progress < 100: ${certificatesButNotComplete.length}`);
    if (certificatesButNotComplete.length > 0) {
        console.log('Sample:', certificatesButNotComplete.slice(0, 2));
    }

    // 5. Summary stats
    const totalEnrollments = await prisma.enrollment.count();
    const enrollmentsWithPositiveProgress = await prisma.enrollment.count({
        where: { progress: { gt: 0 } }
    });
    const enrollmentsComplete = await prisma.enrollment.count({
        where: { progress: 100 }
    });

    console.log('\n--- SUMMARY ---');
    console.log(`Total Enrollments: ${totalEnrollments}`);
    console.log(`With Progress > 0: ${enrollmentsWithPositiveProgress} (${((enrollmentsWithPositiveProgress / totalEnrollments) * 100).toFixed(1)}%)`);
    console.log(`Complete (100%): ${enrollmentsComplete} (${((enrollmentsComplete / totalEnrollments) * 100).toFixed(1)}%)`);
    console.log(`With Progress = 0: ${totalEnrollments - enrollmentsWithPositiveProgress} (${(((totalEnrollments - enrollmentsWithPositiveProgress) / totalEnrollments) * 100).toFixed(1)}%)`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
