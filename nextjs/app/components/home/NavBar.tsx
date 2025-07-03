"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="flex mx-auto bg-gray-900 h-16 text-white justify-between items-center">
            <div className="ml-5">Regulation News Network</div>
            <ul className="flex space-x-4 mr-5">
                <li
                    className={
                        pathname === "/home"
                            ? "bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium underline"
                            : "text-gray-300 hover:underline hover:text-white rounded-md px-3 py-2 text-base font-medium"
                    }
                >
                    <Link href="/home">Home</Link>
                </li>
                <li
                    className={
                        pathname === "/profile"
                            ? "bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium underline"
                            : "text-gray-300 hover:underline hover:text-white rounded-md px-3 py-2 text-base font-medium"
                    }
                >
                    <Link href="/profile">Profile</Link>
                </li>
            </ul>
        </nav>
    );
}
