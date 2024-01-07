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
            login(data.data?.token);
        } catch (error: any) {
            ErrorHandler.handleError(error);
        }
    };

    return (
        <>
            <div className="absolute top-[50px] lg:top-[40px]">
                <div className="font-bold text-4xl text-dark-purple lg:text-4xl xl:text-[50px]">
                    ShareMySight
                </div>
            </div>
            <div className="bg-white w-[90%] m-h-3/5 rounded-[30px] p-2 shadow-md flex mt-[30px] md:mt-[50px] lg:w-[70%] lg:mt-[65px] xl:p-3">
                <p className="border-r-2 flex justify-center items-center">
                    <img
                        src="welcome.png"
                        alt="welcome"
                        className="object-fit-cover w-[400px] hidden sm:block lg:w-[500px] 2xl:w-[550px]"
                    />
                </p>
                <div className="grow-[4] p-3">
                    <div className="p-2">
                        <div className="text-center font-bold text-3xl text-dark-purple xl:text-[40px]">
                            Login
                        </div>
                        <p className="text-center mt-3 text-dark-purple text-sm xl:text-[16px] xl:mt-4">
                            Hey, Enter your details to get sign in to your
                            account
                        </p>
                        <div className="flex flex-col mt-[20px] gap-4 xl:mt-[50px]">
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                onChange={handleOnChange}
                                error={false}
                                inputClassName="rounded-lg py-2 px-3 w-full placeholder:text-[#606060] focus:outline-none bg-pink-purple authInput text-dark-purple h-[35px] xl:h-[45px]"
                            />
                            <Input
                                type="password"
                                name="password"
                                placeholder="Enter Your Password"
                                onChange={handleOnChange}
                                error={false}
                                inputClassName="rounded-lg py-2 px-3  w-full placeholder:text-[#606060] focus:outline-none bg-pink-purple authInput text-dark-purple h-[35px] xl:h-[45px]"
                            />
                        </div>
                        <p className="my-[15px] text-dark-purple text-sm lg:my-[20px] lg:text-md xl:text-[16px] xl:my-[25px]">
                            Having trouble signing in?
                        </p>
                        <button
                            type="submit"
                            className="w-full bg-dark-purple py-2 font-bold rounded-md text-pink-purple text-sm lg:h-[45px]"
                            onClick={handleLogin}
                        >
                            Sign In
                        </button>
                        <div></div>
                        <p className="text-center mt-5 text-dark-purple">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="group transition duration-300"
                            >
                                <span className="font-bold relative text-lavender">
                                    Register Now
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-lavender transform origin-bottom scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                                </span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
