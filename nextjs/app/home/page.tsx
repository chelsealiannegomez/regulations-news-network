import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
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
        return <p>User not found. Please log in again.</p>
    }

    return (
        <div>
            <h1>Welcome back, {user.email}</h1>
        </div>
    )
}