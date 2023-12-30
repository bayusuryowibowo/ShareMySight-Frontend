import { FunctionComponent } from "react";
import VideoChatOutlinedIcon from "@mui/icons-material/VideoChatOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import Link from "next/link";

interface Props {}

const Sidebar: FunctionComponent<Props> = () => {
    return (
        <div className="bg-beige h-screen w-[300px] p-4 shadow-custom z-10">
            <div className="text-2xl font-bold text-branch pl-2">
                ShareMySight
            </div>
            <ul className="mt-[40px]">
                <li className="transition ease-in-out delay-50 hover:bg-wood hover:text-beige p-2 rounded-md">
                    <VideoChatOutlinedIcon />
                    <Link href="/">
                        <div className="inline-block ml-2 text-lg">
                            Live Call
                        </div>
                    </Link>
                </li>
                <li className="mt-[25px] transition ease-in-out delay-50 hover:bg-wood hover:text-beige p-2 rounded-md">
                    <ChatOutlinedIcon />
                    <Link href="/chat">
                        <div className="inline-block ml-2 text-lg">
                            Live Chat
                        </div>
                    </Link>
                </li>
                <li className="mt-[25px] transition ease-in-out delay-50 hover:bg-wood hover:text-beige p-2 rounded-md">
                    <SmartToyOutlinedIcon />
                    <Link href="/ai">
                        <div className="inline-block ml-2 text-lg">Ask AI</div>
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
