import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import prisma from '@/lib/prisma';
// import { useRouter } from 'next/navigation';

export default async function Page () {
    // const router = useRouter()
    const sessionCookie = (await cookies()).get('session')?.value;

    if (!sessionCookie) {
        return<p>Please log in</p>
    }

    const payload = await decrypt(sessionCookie);

    if (!payload) {
        return <p>Session expired or invalid. Please log in again.</p>
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