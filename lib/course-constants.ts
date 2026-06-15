// Cursos con comportamiento especial de moneda.
// Estos IDs se usan tanto en Server Components como en Client Components.

// Curso presencial en Costa Rica — se cobra en USD, sin IVA.
export const COSTA_RICA_COURSE_ID = 'cmmdxl4jq00002djx81x89qm2';

// Array de todos los cursos que se cobran en USD
export const USD_COURSE_IDS = [COSTA_RICA_COURSE_ID];

// --- Bundle del Seminario Online en Vivo ---
// Al comprar el Seminario se otorga acceso (Enrollment) también a Team Leader
// y Contravigilancia online como bono incluido.
export const SEMINARIO_ONLINE_COURSE_ID = 'cmq8mfhot0000jgymc9u2zud7';

// Cursos online que se desbloquean como bono al comprar el Seminario.
export const SEMINARIO_BONUS_COURSE_IDS = [
    'cmio13v7r000064w1fs838sgw', // Team Leader en Protección Ejecutiva
    'cmio13v7u000164w1bhkqj8ej', // Contravigilancia Para Protección Ejecutiva (online)
];

// Grupo de WhatsApp al que se invita a los compradores del Seminario (va en el correo).
export const SEMINARIO_WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/KB6ss3UzlIDKVTlPbHTeqF';
