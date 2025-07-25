"use client";
import { useState } from "react";
import SideBar from "./SideBar";
import EditProfile from "./EditProfile";
import EditLocations from "./EditLocations";
import EditPreferences from "./EditPreferences";
import type { ProfilePageProps } from "@/lib/types";

export default function ProfilePage({ user }: ProfilePageProps) {
    const [setting, setSetting] = useState<string>("profile");

    return (
        <div className="bg-gray-100 pb-10 text-black">
            <div className="mx-12 h-24 flex items-center font-bold">
                <h1 className="text-3xl">Account Settings</h1>
            </div>
            <div className="flex mx-10 rounded-3xl overflow-hidden">
                <SideBar setting={setting} setSetting={setSetting} />
                {setting === "profile" ? <EditProfile user={user} /> : null}
                {setting === "locations" ? <EditLocations user={user} /> : null}
                {setting === "preferences" ? (
                    <EditPreferences user={user} />
                ) : null}
            </div>
        </div>
    );
}
