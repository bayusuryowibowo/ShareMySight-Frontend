"use client";
import { FunctionComponent, useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

interface Props {}

const Navbar: FunctionComponent<Props> = () => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        setUser(localStorage.getItem("username"));
    }, []);

    return (
        <nav className="px-[35px] pt-7 pb-2 text-right flex justify-end">
            <div className="bg-dark-purple px-8 py-3 rounded-[20px] flex gap-3 items-center shadow-card h-[54px]">
                <AccountCircleIcon className="text-3xl text-white" />
                <p className="text-white font-bold">{user}</p>
            </div>
        </nav>
    );
};

export default Navbar;
