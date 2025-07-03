import { User } from "@/lib/definitions";
import Image from "next/Image";

type ProfilePageProps = {
    user: User;
};

export default function EditProfile({ user }: ProfilePageProps) {
    return (
        <div className="w-4/5 bg-white px-10">
            <h1 className="pt-10 text-2xl font-semibold mb-8">My Profile</h1>
            <div>
                <div className="relative border border-gray-300 rounded-3xl p-7 mb-8">
                    <h1 className="font-semibold mb-7 text-lg">
                        Personal Information
                    </h1>
                    <div className="flex">
                        <div className="w-1/2">
                            <p className="text-gray-500 text-sm">First Name</p>
                            <p>{user.firstName}</p>
                        </div>
                        <div className="w-1/2">
                            <p className="text-gray-500 text-sm">Last Name</p>
                            <p>{user.lastName}</p>
                        </div>
                    </div>
                    <div className="absolute right-5 top-5 flex">
                        Edit{" "}
                        <Image
                            src="/edit.png"
                            alt="edit icon"
                            width={25}
                            height={5}
                        />
                    </div>
                </div>
                <div>
                    <div className="relative border border-gray-300 rounded-3xl p-7">
                        <h1 className="font-semibold mb-7 text-lg">
                            Email Address
                        </h1>
                        <div className="w-1/2">
                            <p className="text-gray-500 text-sm">
                                Email Address
                            </p>
                            <p>{user.email}</p>
                        </div>
                        <div className="absolute right-5 top-5 flex">
                            Edit{" "}
                            <Image
                                src="/edit.png"
                                alt="edit icon"
                                width={25}
                                height={5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
