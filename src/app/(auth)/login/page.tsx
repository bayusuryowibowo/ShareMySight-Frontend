"use client";

import Input from "@/components/input";
import { ChangeEvent, useState } from "react";

interface userData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [userData, setUserData] = useState<userData>({
        email: "",
        password: "",
    });

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const key = e.target.name;
        const value = e.target.value;
        setUserData({ ...userData, [key]: value });
    };

    return (
        <div className=" bg-white w-2/3 h-4/5 rounded-[30px] shadow-md p-5 flex">
            <p className="border-2 border-blue-500 w-[400px]">Ini test</p>
            <div className="border-2 border-rose-500 grow-[4]">
                <div className="text-center font-bold text-3xl">Login</div>
                <p className="text-center mt-2">
                    Hey, Enter your details to get sign in to your account
                </p>
                <div>
                    <Input
                        type="text"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleOnChange}
                        error={false}
                        className=""
                    />
                    <Input
                        type="text"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleOnChange}
                        error={false}
                        className=""
                    />
                </div>
            </div>
        </div>
    );
}
