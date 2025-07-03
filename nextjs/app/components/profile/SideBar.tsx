type SideBarProps = {
    setting: string;
    setSetting: React.Dispatch<React.SetStateAction<string>>;
};

export default function SideBar({ setting, setSetting }: SideBarProps) {
    const baseClasses =
        "text-xl mb-3 py-3 px-5 self-start rounded-3xl cursor-pointer";
    const selectedClasses = "font-semibold bg-gray-200 text-black";
    const unselectedClasses =
        "text-gray-600 hover:bg-gray-200 hover:text-black";

    return (
        <div className="w-1/5 min-h-screen bg-white relative flex flex-col px-5 pt-8">
            <div
                className={`${baseClasses} ${
                    setting === "profile" ? selectedClasses : unselectedClasses
                }`}
                onClick={() => setSetting("profile")}
            >
                My Profile
            </div>
            <div
                className={`${baseClasses} ${
                    setting === "locations"
                        ? selectedClasses
                        : unselectedClasses
                }`}
                onClick={() => setSetting("locations")}
            >
                Locations
            </div>
            <div
                className={`${baseClasses} ${
                    setting === "preferences"
                        ? selectedClasses
                        : unselectedClasses
                }`}
                onClick={() => setSetting("preferences")}
            >
                Preferences
            </div>
            <div className="bg-gray-200 w-[1px] h-full absolute right-0 top-5 bottom-5"></div>
        </div>
    );
}
