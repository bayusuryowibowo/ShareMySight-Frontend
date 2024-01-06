"use client";
import { FunctionComponent } from "react";
import VideoChatIcon from "@mui/icons-material/VideoChat";
import ChatIcon from "@mui/icons-material/Chat";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "@/context/authContext";
import { useContext } from "react";
import Link from "next/link";
import ErrorHandler from "@/utils/errorHandling";

const Sidebar: FunctionComponent = () => {
    const { logout } = useContext(AuthContext);

    const handleLogout = async (): Promise<void> => {
        try {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            logout();
        } catch (error: any) {
            ErrorHandler.handleError(error);
        }
    };

    return (
        <div className="h-screen w-[125px] p-4 shadow-custom z-10 bg-dark-purple border-r-[5px] border-grey-purple">
            <div className="text-center text-white">
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-[50px] h-[50px] object-contain mx-auto"
                />
            </div>
            <ul className="mt-[120px]">
                <li className="transition ease-in-out delay-50 text-white hover:bg-lavender p-4 rounded-md w-full flex flex-col items-center">
                    <Link href="/video-call">
                        <VideoChatIcon className="text-3xl" />
                    </Link>
                    <div>Video</div>
                </li>
                <li className="mt-[15px] transition ease-in-out delay-50 text-white hover:bg-lavender p-4 rounded-md w-full flex flex-col items-center">
                    <Link href="/chat">
                        <ChatIcon className="text-3xl" />
                    </Link>
                    <div>Chat</div>
                </li>
                <li className="mt-[15px] transition ease-in-out delay-50 text-white hover:bg-lavender p-4 rounded-md w-full flex flex-col items-center">
                    <Link href="/ai">
                        <SmartToyIcon className="text-3xl" />
                    </Link>
                    <div>Ask AI</div>
                </li>
                <div className="border-2 mt-5"></div>
                <li
                    className="mt-[15px] transition ease-in-out delay-50 text-white hover:bg-lavender p-4 rounded-md w-full flex flex-col items-center hover:cursor-pointer"
                    onClick={handleLogout}
                >
                    <LogoutIcon className="text-3xl" />
                    <div>Logout</div>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
