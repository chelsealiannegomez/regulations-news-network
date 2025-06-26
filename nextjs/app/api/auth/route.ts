import prisma from '../../../lib/prisma';
import { hashPassword } from '@/lib/bcrypt'
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed'});
    }

    const { email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
            }
        })
        return res.status(201).json(newUser)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong" });
    }
    
}

// export async function retrieve(req: NextApiRequest, res: NextApiResponse) {
//     const users = await prisma.user.findMany();
//     res.json(users)
// }