import { redirect } from "next/navigation";

export default function Home() {
    redirect("/login");

    return (
        <div className="flex items-center justify-center">
            <p>Loading</p>
        </div>
    );
}
