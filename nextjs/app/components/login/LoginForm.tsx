import Link from 'next/link';

export default function LoginForm() {


  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className="mb-6 text-2xl">
          Log in
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 block text-xs font-medium text-gray-900"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="w-full rounded-md border border-gray-200 py-[10px] pl-2 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter email address"
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
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex w-full items-center justify-center">
            <button className="bg-gray-200 py-3 w-1/2 rounded-md">
            Log in
            </button>
        </div>
        <p className="mt-4">No account? Register <Link href="/register" className="font-bold">here</Link></p>
      </div>
    </form>
  );
}
