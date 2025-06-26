'use client';

import { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterForm() {
    const router = useRouter();
    const userRef = useRef<HTMLInputElement>(null);
    const passRef = useRef<HTMLInputElement>(null);

    const [successfulLogin, setSuccessfulLogin] = useState("");


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = userRef.current?.value;
        const password = passRef.current?.value;
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( {email, password} )
            })
            if (response.ok) {
                router.push('/home')
            }
            const message = await response.json();
            setSuccessfulLogin(message.message);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form className="space-y-3" onSubmit={onSubmit}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className="mb-6 text-2xl">
                Login
                </h1>
                <div className="w-full">
                <div>
                    <label
                    className="mb-3 block text-xs font-medium text-gray-900"
                    >
                    Email Address
                    </label>
                    <div className="relative">
                    <input
                        className="w-full rounded-md border border-gray-200 py-[10px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        ref={userRef}
                        required
                    />
                    </div>
                </div>
                <div className="mt-4">
                    <label
                    className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                    htmlFor="password"
                    >
                    Password
                    </label>
                    <div className="relative">
                    <input
                        className="w-full rounded-md border border-gray-200 py-[10px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        required
                        minLength={6}
                        ref={passRef}
                    />
                    </div>
                </div>
                </div>
                <div className="mt-6 flex w-full items-center justify-center">
                    <button className="bg-gray-200 py-3 w-1/2 rounded-md">
                    Login
                    </button>
                </div>
                <p className="pt-3 text-red-800">{successfulLogin}</p>
                <p>Don&apos;t have an account? Register <Link href="/register"><b>here</b></Link></p>
            </div>
        </form>
    );
}
