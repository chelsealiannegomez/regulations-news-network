"use client";
import { useState } from "react";
import { User } from "@/lib/definitions";
import SideBar from "./SideBar";
import EditProfile from "./EditProfile";
import EditLocations from "./EditLocations";
import EditPreferences from "./EditPreferences";

type ProfilePageProps = {
    user: User;
};

export default function ProfilePage({ user }: ProfilePageProps) {
    const [setting, setSetting] = useState<string>("profile");
    return (
        <div className="bg-gray-100">
            <div className="mx-12 h-24 flex items-center font-bold">
                <h1 className="text-3xl">Account Settings</h1>
            </div>
            <div className="flex mx-10 rounded-3xl overflow-hidden">
                <SideBar setting={setting} setSetting={setSetting} />
                {setting === "profile" ? <EditProfile /> : null}
                {setting === "locations" ? <EditLocations /> : null}
                {setting === "preferences" ? <EditPreferences /> : null}
            </div>
        </div>
    );
}
