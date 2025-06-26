import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/bcrypt'
import { createSession } from '@/lib/session'
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
    const { email, password } = await request.json();

    try {

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            return NextResponse.json({ message: 'Email is already registered' }, { status: 409 });
        }       

        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
            }
        })
        await createSession(newUser.id);

        return NextResponse.json({ message: 'Successfully registered and logged in!' }, { status: 200 });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: 'Something went wrong' }, { status: 401 });
    }
};
