import { Suspense } from 'react';
import LoginForm from '../components/login/LoginForm';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="relative mx-auto flex w-full flex-col max-w-[400px]">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}