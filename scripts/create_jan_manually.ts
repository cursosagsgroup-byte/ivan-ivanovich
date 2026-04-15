import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function main() {
  const email = 'Jprovandrope@icloud.com';
  const name = 'Jan Provandrope';
  const passwordClear = 'Counter.2025';
  const courseId = 'cmiq7oga703zjkvegaq8v1ir4'; // Counter Surveillance for Executive Protection
  const courseTitle = 'Counter Surveillance for Executive Protection';

  console.log(`Creating user: ${email}...`);

  // Check if exists
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const hashedPassword = await bcrypt.hash(passwordClear, 12);
    user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'STUDENT',
        emailVerified: new Date(),
      }
    });
    console.log(`✅ User created with ID: ${user.id}`);
  } else {
    console.log(`⚠️ User already exists with ID: ${user.id}`);
    // Update password just in case
    const hashedPassword = await bcrypt.hash(passwordClear, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, emailVerified: new Date() }
    });
    console.log(`✅ Password updated.`);
  }

  console.log(`Enrolling in course: ${courseTitle}...`);

  // Create or find enrollment
  let enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: courseId
      }
    }
  });

  if (!enrollment) {
    enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        progress: 0,
      }
    });
    console.log(`✅ Enrollment created.`);
  } else {
    console.log(`⚠️ Enrollment already exists.`);
  }

  console.log(`Creating manual order...`);

  // Create order
  const orderNumber = `ORD-MANUAL-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      orderNumber,
      total: 2500,
      status: 'completed',
      currency: 'MXN',
      paymentMethod: 'manual_fix',
      billingName: name,
      billingEmail: email,
      items: {
        create: [
          {
            courseId: courseId,
            price: 2500,
          }
        ]
      }
    }
  });

  console.log(`✅ Order created: ${order.orderNumber}`);

  console.log('\n--- ALL DONE ---');
  console.log(`Email: ${email}`);
  console.log(`Password: ${passwordClear}`);
  console.log(`Course: ${courseTitle}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
