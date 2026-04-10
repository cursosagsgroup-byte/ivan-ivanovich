
import { prisma } from '../lib/prisma';

async function main() {
  const email = 'Jprovandrope@icloud.com';
  console.log(`--- INVESTIGATING ${email} ---`);

  // Search in User
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } }
  });
  console.log('USER found:', user ? 'YES' : 'NO');
  if (user) console.log(user);

  // Search in Order
  const order = await prisma.order.findFirst({
    where: { billingEmail: { equals: email, mode: 'insensitive' } },
    orderBy: { createdAt: 'desc' },
    include: { payment: true }
  });
  console.log('ORDER found:', order ? 'YES' : 'NO');
  if (order) console.log(order);

  // Search in Enrollment
  if (user) {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: { course: true }
    });
    console.log('ENROLLMENTS:', enrollments.length);
    enrollments.forEach(e => console.log(`- ${e.course.title} (Progress: ${e.progress}%)`));
  }

  // All recent orders to see if there's a misspelled one
  console.log('\nLast 10 orders overall:');
  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  recentOrders.forEach(o => console.log(`- ${o.billingEmail} (${o.status}) - ${o.createdAt.toISOString()}`));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
