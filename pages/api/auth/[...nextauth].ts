import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

import { NextApiRequest, NextApiResponse } from "next"

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    console.log(`[NextAuth Handler] Incoming Request: ${req.method} ${req.url}`);

    // Explicitly handle OPTIONS for CORS preflight robustness
    if (req.method === 'OPTIONS') {
        console.log('[NextAuth Handler] Handling OPTIONS request');
        res.status(200).end();
        return;
    }

    try {
        // @ts-ignore
        await NextAuth(req, res, authOptions);
    } catch (error) {
        console.error('[NextAuth Handler] Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
