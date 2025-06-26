import { cookies } from 'next/headers';
import { decrypt, updateSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';


export default async function Page () {
    const sessionCookie = (await cookies()).get('session')?.value;

    if (!sessionCookie) {
        // No session found, redirect to login page
        redirect('/login');
    }

    const payload = await decrypt(sessionCookie);

    if (!payload) {
        // Session expired or invalid, redirect to login page
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
    })

    if (!user) {
        // User not found, redirect to login page
        redirect('/login');
    } 

    return (
        <div>
            <h1>Welcome back, {user.firstName}</h1>
        </div>
    )
}