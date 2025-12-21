import { prisma } from '../lib/prisma';

async function main() {
    try {
        console.log('Checking Users...');
        const usersCount = await prisma.user.count({ where: { role: 'STUDENT' } });
        console.log(`Found ${usersCount} students.`);

        console.log('Checking Leads...');
        // This will throw if Lead model doesn't exist on client
        const leadsCount = await prisma.lead.count();
        console.log(`Found ${leadsCount} leads.`);

        console.log('Checking WhatsAppContacts...');
        const waCount = await prisma.whatsAppContact.count();
        console.log(`Found ${waCount} WhatsApp contacts.`);

        console.log('Verification Success!');
    } catch (error) {
        console.error('Verification Failed:', error);
    }
}

main();
