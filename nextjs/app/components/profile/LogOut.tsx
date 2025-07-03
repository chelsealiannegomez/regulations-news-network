"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogOut() {
    const router = useRouter();

    const handleLogOut = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (err) {
            console.error("Error logging out: ", err);
        }
    };

    return (
        <div
            onClick={handleLogOut}
            className="text-red-700 mt-3 py-3 px-5 flex cursor-pointer rounded-3xl hover:bg-red-100"
        >
            Log out{" "}
            <Image
                src="/logout.png"
                alt="Log Out"
                width={30}
                height={20}
                className="pl-2"
            />
        </div>
    );
}
