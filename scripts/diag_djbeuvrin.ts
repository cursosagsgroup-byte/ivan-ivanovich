import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const email = 'djbeuvrin@gmail.com'
    const user = await (prisma.user as any).findUnique({ where: { email } })
    if (!user) { console.log('NO ENCONTRADO'); return; }
    console.log(`Teléfono en BD: "${user.phone}"`)

    // Simular cómo lo procesa sendWhatsAppMessage
    const phone = user.phone || ''
    const cleanPhone = phone.replace(/\D/g, '')
    const jid = `${cleanPhone}@s.whatsapp.net`
    console.log(`JID que se usa: ${jid}`)

    // Cómo debería ser para México
    let correctJid = ''
    if (cleanPhone.startsWith('52')) {
        correctJid = `${cleanPhone}@s.whatsapp.net`
    } else {
        correctJid = `52${cleanPhone}@s.whatsapp.net`
    }
    console.log(`JID correcto MX: ${correctJid}`)
    console.log(`¿Coinciden?: ${jid === correctJid ? '✅ SÍ' : '❌ NO - aquí está el bug'}`)
}
main().then(async()=>{ await prisma.$disconnect() }).catch(console.error)
