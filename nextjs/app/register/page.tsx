'use client';

import { Suspense } from 'react';
import RegisterForm from '../components/register/RegisterForm';
 
export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="relative mx-auto flex w-full flex-col max-w-[400px]">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </main>
  );
}