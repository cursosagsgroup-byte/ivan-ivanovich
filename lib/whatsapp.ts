import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers,
    WASocket
} from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Global state to hold the socket in memory across hot reloads (dev)
declare global {
    var whatsappSocket: WASocket | undefined;
    var whatsappQR: string | undefined; // Store QR code when waiting
}

const AUTH_FOLDER = 'whatsapp_auth';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite-preview-02-05",
    systemInstruction: `
        Eres el asistente de IA oficial de la Academia de Protección Ejecutiva Ivan Ivanovich. Tu tono es profesional, cortés y experto en seguridad.
        
        INFORMACIÓN CLAVE:
        
        SOBRE IVAN IVANOVICH:
        - Experto global en seguridad con >30 años de experiencia.
        - Primer civil en capacitar a la Infantería de Marina Española y UPP de Costa Rica.
        - Autor del bestseller "Protección Ejecutiva en el Siglo XXI".
        - Su academia está en el TOP 9 mundial según EP Wired.
        
        CURSOS DISPONIBLES:
        1. TEAM LEADER EN PROTECCIÓN EJECUTIVA
           - Precio: ~$1,900 MXN (oferta) / ~$5,000 (normal)
           - Enfoque: Liderazgo, gestión de equipos, planeación de misiones.
           - Certificado: Sí.
           
        2. CONTRAVIGILANCIA EN PROTECCIÓN EJECUTIVA
           - Precio: ~$2,500 MXN (oferta) / ~$5,000 (normal)
           - Enfoque: Detectar vigilancia hostil, rutas, seguridad preventiva.
           - Certificado: Sí.
           
        SOPORTE DE CUENTA:
        - ¿Olvidaste tu contraseña?: Ve a https://ivanivanovich.com/forgot-password e ingresa tu correo. Recibirás un enlace.
        - ¿Problemas de acceso?: Si es tu primera vez en la nueva plataforma, es OBLIGATORIO restablecer la contraseña.
        
        INSTRUCCIONES:
        - Responde dudas sobre los cursos, precios y temarios.
        - Si alguien tiene problemas técnicos, guíalos amablemente.
        - Sé conciso en WhatsApp.
    `
});

// Remove local 'sock' variable to prevent Zombie state
// let sock: WASocket | undefined = global.whatsappSocket; 

// Track connection status explicitly
let connectionStatus: 'open' | 'connecting' | 'close' = 'close';

export const initWhatsApp = async () => {
    console.log('INIT WHATSAPP: Starting...');

    // Check global directly
    if (global.whatsappSocket) {
        console.log('INIT WHATSAPP: Socket already exists.');
        return global.whatsappSocket;
    }

    // Ensure global is cleared just in case
    global.whatsappSocket = undefined;
    global.whatsappQR = undefined;
    connectionStatus = 'connecting';

    console.log('INIT WHATSAPP: Loading auth...');
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    // Dynamic version fetching with timeout
    let version: [number, number, number] = [2, 3000, 1015901307]; // Fallback
    try {
        const fetchPromise = fetchLatestBaileysVersion();
        const timeoutPromise = new Promise<{ version: [number, number, number] }>((_, reject) =>
            setTimeout(() => reject(new Error('Version fetch timeout')), 2000)
        );

        const v = await Promise.race([fetchPromise, timeoutPromise]);
        version = v.version;
        console.log(`INIT WHATSAPP: Fetched latest version ${version.join('.')}`);
    } catch (e) {
        console.error('INIT WHATSAPP: Failed to fetch version (or timed out), using fallback', e);
    }

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        retryRequestDelayMs: 2000,
        browser: Browsers.macOS('Chrome'),
        markOnlineOnConnect: true,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            global.whatsappQR = qr; // Save QR for frontend
        }

        if (connection === 'close') {
            connectionStatus = 'close';
            // Detailed error logging
            const error = lastDisconnect?.error as any;
            const statusCode = error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.error('WhatsApp connection closed:', {
                statusCode,
                error: error?.message,
                stack: error?.stack,
                shouldReconnect
            });

            if (shouldReconnect) {
                // IMPORTANT: Reset global before reconnecting to ensure clean slate
                global.whatsappSocket = undefined;
                initWhatsApp(); // Reconnect
            }
        } else if (connection === 'open') {
            console.log('WhatsApp connection opened');
            connectionStatus = 'open';
            global.whatsappQR = undefined; // Clear QR
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && m.type === 'notify') {
            const jid = msg.key.remoteJid;
            const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

            if (jid && text) {
                console.log(`MSG RECEIVED from ${jid}: ${text}`);

                // AI Processing
                try {
                    console.log(`CHECKING ENABLE_AI_REPLY: ${process.env.ENABLE_AI_REPLY}`);

                    if (process.env.ENABLE_AI_REPLY === 'true') {
                        console.log('GENERATING CONTENT with Gemini...');
                        const chat = await model.generateContent(text);
                        const response = chat.response.text();
                        console.log(`GENERATED RESPONSE: ${response.substring(0, 50)}...`);

                        await sock?.sendMessage(jid, { text: response });
                        console.log('RESPONSE SENT.');
                    } else {
                        console.log('AI REPLY DISABLED.');
                    }
                } catch (error) {
                    console.error('Error in AI Reply:', error);
                    // Send error to user
                    await sock?.sendMessage(jid, { text: 'Lo siento, tuve un error de conexión con mi cerebro (Tráfico alto). Intenta de nuevo en unos momentos.' });
                }
            }
        }
    });

    global.whatsappSocket = sock;
    return sock;
};

export const requestPairingCode = async (phoneNumber: string): Promise<string> => {
    // Helper to ensure socket is ready
    const ensureSocket = async () => {
        if (!global.whatsappSocket) {
            console.log('PAIRING: Socket missing, initializing...');
            await initWhatsApp();
        }
        if (!global.whatsappSocket) throw new Error('Failed to create socket');
        return global.whatsappSocket;
    };

    let lastError: any;

    // Aggressive Retry Loop (3 attempts)
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            // Strip any non-numeric chars (like +) just in case
            const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
            console.log(`PAIRING: Attempt ${attempt}/3 for ${cleanPhone}...`);

            // 1. Get/Create Socket
            const sock = await ensureSocket();

            // 2. Wait a bit for stability
            await new Promise(r => setTimeout(r, 2000));

            // 3. Request Code
            const code = await sock.requestPairingCode(cleanPhone);
            console.log(`PAIRING CODE SUCCESS: ${code}`);
            return code;

        } catch (error: any) {
            console.error(`PAIRING Attempt ${attempt} Failed:`, error);

            // If it's a connection issue, force reset state before next try
            if (attempt < 3) {
                console.log('PAIRING: Retrying in 4 seconds...');

                // Force cleanup
                if (global.whatsappSocket) {
                    try { global.whatsappSocket.end(undefined); } catch (e) { }
                    global.whatsappSocket = undefined;
                }
                connectionStatus = 'close';

                // Re-init immediately for next loop
                await initWhatsApp();
                // Wait slightly longer
                await new Promise(r => setTimeout(r, 4000));
            }
        }
    }

    // If all retries fail
    throw lastError || new Error('Failed to generate pairing code after 3 attempts');
};

export const getQR = () => global.whatsappQR;
export const isConnected = () => {
    // Strict check: Must have user AND be in 'open' state
    return !!global.whatsappSocket?.user && connectionStatus === 'open';
};
export const getSocket = () => global.whatsappSocket;

export const sendWhatsAppMessage = async (phone: string, message: string) => {
    const sock = global.whatsappSocket;
    if (!sock) {
        console.warn('WhatsApp socket check failed: Socket not available');
        return false;
    }

    try {
        // Basic cleanup: remove '+' and any non-digit chars
        const cleanPhone = phone.replace(/\D/g, '');
        const jid = `${cleanPhone}@s.whatsapp.net`;

        await sock.sendMessage(jid, { text: message });
        return true;
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error);
        return false;
    }
};
