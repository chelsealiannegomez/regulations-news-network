type SideBarProps = {
    setting: string;
    setSetting: React.Dispatch<React.SetStateAction<string>>;
};

export default function SideBar({ setting, setSetting }: SideBarProps) {
    return (
        <div className="w-1/5 min-h-screen bg-white relative flex flex-col px-5 pt-8">
            <div
                className={
                    setting === "profile"
                        ? "text-xl mb-3 py-3 px-5 self-start rounded-3xl bg-gray-200 text-black cursor-pointer"
                        : "text-xl mb-3 text-gray-600 py-3 px-5 self-start rounded-3xl hover:bg-gray-200 hover:text-black cursor-pointer"
                }
                onClick={() => setSetting("profile")}
            >
                My Profile
            </div>
            <div
                className={
                    setting === "locations"
                        ? "text-xl mb-3 py-3 px-5 self-start rounded-3xl bg-gray-200 text-black cursor-pointer"
                        : "text-xl mb-3 text-gray-600 py-3 px-5 self-start rounded-3xl hover:bg-gray-200 hover:text-black cursor-pointer"
                }
                onClick={() => setSetting("locations")}
            >
                Locations
            </div>
            <div
                className={
                    setting === "preferences"
                        ? "text-xl mb-3 py-3 px-5 self-start rounded-3xl bg-gray-200 text-black cursor-pointer"
                        : "text-xl mb-3 text-gray-600 py-3 px-5 self-start rounded-3xl hover:bg-gray-200 hover:text-black cursor-pointer"
                }
                onClick={() => setSetting("preferences")}
            >
                Preferences
            </div>
            <div className="bg-gray-200 w-[1px] h-full absolute right-0 top-5 bottom-5"></div>
        </div>
    );
}
