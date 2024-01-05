"use client";
import { FunctionComponent } from "react";
import VideoChatOutlinedIcon from "@mui/icons-material/VideoChatOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import Link from "next/link";

const Sidebar: FunctionComponent = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div className="h-screen w-[125px] p-4 shadow-custom z-10 bg-[#333449]">
            <div className="text-center text-white">Logo</div>
            <ul className="mt-[80px]">
                <li className="transition ease-in-out delay-50 text-white hover:bg-[#BCD9B5] p-4 rounded-md w-full flex flex-col items-center">
                    <Link href="/">
                        <VideoChatOutlinedIcon className="text-3xl" />
                    </Link>
                    <div>Video</div>
                </li>
                <li className="mt-[15px] transition ease-in-out delay-50 text-white hover:bg-[#BCD9B5] p-4 rounded-md w-full flex flex-col items-center">
                    <Link href="/chat">
                        <ChatOutlinedIcon className="text-3xl" />
                    </Link>
                    <div>Chat</div>
                </li>
                <li className="mt-[15px] transition ease-in-out delay-50 text-white hover:bg-[#BCD9B5] p-4 rounded-md w-full flex flex-col items-center">
                    <Link href="/ai">
                        <SmartToyOutlinedIcon className="text-3xl" />
                    </Link>
                    <div>Ask AI</div>
                </li>
                <li
                    className="mt-[15px] transition ease-in-out delay-50 text-white hover:bg-[#BCD9B5] p-4 rounded-md w-full flex flex-col items-center hover:cursor-pointer"
                    onClick={() => {
                        logout();
                    }}
                >
                    <LogoutIcon className="text-3xl" />
                    <div>Logout</div>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
