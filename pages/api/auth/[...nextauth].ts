import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

import { NextApiRequest, NextApiResponse } from "next"

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    // @ts-ignore
    return await NextAuth(req, res, authOptions)
}
