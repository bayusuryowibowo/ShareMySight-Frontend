"use client";
import Input from "@/components/input";
import Link from "next/link";
import { ChangeEvent, useContext, useState } from "react";
import { apiClient } from "@/utils/axios";
import ErrorHandler from "@/utils/errorHandling";
import { AuthContext } from "@/context/authContext";

interface userData {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const [userData, setUserData] = useState<userData>({
        email: "",
        password: "",
    });

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const key = e.target.name;
        const value = e.target.value;
        setUserData({ ...userData, [key]: value });
    };

    const handleLogin = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        try {
            const { data } = await apiClient.post("/login", userData);
            localStorage.setItem("username", data.data.username);
            localStorage.setItem("role", data.data.role);
            login(data.data.token);
        } catch (error: any) {
            ErrorHandler.handleError(error);
        }
    };

    return (
        <>
            <div className="p-2">
                <div className="text-center font-bold text-4xl">Login</div>
                <p className="text-center mt-3">
                    Hey, Enter your details to get sign in to your account
                </p>
                <div className="flex flex-col mt-[50px] gap-4">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleOnChange}
                        error={false}
                        inputClassName="border-2 rounded-md py-2 px-3 w-full placeholder:text-[#606060] focus:outline-none"
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter Your Password"
                        onChange={handleOnChange}
                        error={false}
                        inputClassName="border-2 rounded-md py-2 px-3  w-full placeholder:text-[#606060] focus:outline-none"
                    />
                </div>
                <p className="my-[25px]">Having trouble signing in?</p>
                <button
                    type="submit"
                    className="w-full bg-leaf py-3 font-bold rounded-md text-white"
                    onClick={handleLogin}
                >
                    Sign In
                </button>
                <p className="my-[40px] text-center">-- Or Sign in with --</p>
                <div></div>
                <p className="text-center">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="group transition duration-300"
                    >
                        <span className="font-bold relative text-sky-600">
                            Register Now
                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-600 transform origin-bottom scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                        </span>
                    </Link>
                </p>
            </div>
        </>
    );
}
