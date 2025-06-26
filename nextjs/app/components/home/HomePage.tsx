import { User } from '@/lib/definitions'

type HomePageProps = {
  user: User;
};

export default function HomePage({ user }: HomePageProps) {
  return (
    <div>
        <header className="h-20 flex justify-center items-center text-xl">
            Regulations News Network
        </header>
      <p>Welcome, {user.firstName}</p>
    </div>
  );
}