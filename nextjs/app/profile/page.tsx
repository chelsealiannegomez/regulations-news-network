import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfilePage from "../components/profile/ProfilePage";

export default async function Page() {
    const sessionCookie = (await cookies()).get("session")?.value;

    if (!sessionCookie) {
        // No session found, redirect to login page
        redirect("/login");
    }

    const payload = await decrypt(sessionCookie);

    if (!payload) {
        // Session expired or invalid, redirect to login page
        redirect("/login");
    }

    const user =
        typeof payload.userId === "number"
            ? await prisma.user.findUnique({ where: { id: payload.userId } })
            : null;

    if (!user) {
        redirect("/login");
    }

    return <ProfilePage user={user} />;
}
