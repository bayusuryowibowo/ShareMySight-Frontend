"use client";
import Input from "@/components/input";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { UserRole } from "./role";
import SelectOption from "@/components/selectOption";
import axios from "axios";
import { redirect } from "next/navigation";
const URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface userData {
    email: string;
    password: string;
    role: UserRole;
    languageId: string;
}

const RegisterPage = () => {
    const [userData, setUserData] = useState<userData>({
        email: "",
        password: "",
        role: UserRole.Volunteer,
        languageId: "",
    });

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const key = e.target.name;
        const value = e.target.value;
        setUserData({ ...userData, [key]: value });
    };

    const handleRegister = (e: React.MouseEvent<HTMLButtonElement>): void => {
        axios({
            url: `${URL}/register`,
            method: "POST",
            data: userData,
        })
            .then((res) => {
                console.log("success");
                redirect("/login");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    console.log(userData);

    return (
        <>
            <div className="text-center font-bold text-4xl">Register</div>
            <p className="text-center mt-3">
                Hey, Enter your details to get sign up your account
            </p>
            <div className="flex justify-center gap-8 my-8">
                <div className="max-w-[150px] w-full">
                    <div
                        className={`cursor-pointer outline-dotted p-4 rounded-md relative ${
                            userData.role === UserRole.Volunteer &&
                            "border-2 border-solid border-[#FEC887] outline-none"
                        }`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value={UserRole.Volunteer}
                            onChange={handleOnChange}
                            className="absolute inset-0 opacity-0"
                        />
                        <img
                            src="https://media-public.canva.com/JbmNs/MAFIVoJbmNs/1/tl.png"
                            alt="Role: volunteer"
                            className="object-cover h-[80px] mx-auto"
                        />
                    </div>
                    <p className="text-center mt-2">I'm a volunteer</p>
                </div>
                <div className="max-w-[150px] w-full">
                    <div
                        className={`cursor-pointer outline-dotted p-4 rounded-md relative ${
                            userData.role === UserRole.NeedAssistance &&
                            "border-2 border-solid border-[#FEC887] outline-none"
                        }`}
                    >
                        <input
                            type="radio"
                            name="role"
                            value={UserRole.NeedAssistance}
                            onChange={handleOnChange}
                            className="absolute inset-0 opacity-0"
                        />
                        <img
                            src="https://media-public.canva.com/YQpyY/MAFdzDYQpyY/1/tl.png"
                            alt="Role: need assistance"
                            className="object-cover h-[80px] mx-auto"
                        ></img>
                    </div>
                    <p className="text-center mt-2">I need assistance</p>
                </div>
            </div>
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
                <SelectOption
                    options={[{ label: "test", value: "test " }]}
                    name="language"
                    placeholder="Select Language"
                    className="placeholder:text-[#606060] focus:outline-none"
                />
            </div>
            <button
                className="w-full bg-[#FEC887] py-3 font-bold rounded-md mt-[40px]"
                onClick={handleRegister}
            >
                Register
            </button>
            <p className="text-center mt-4">
                Already have account?{" "}
                <Link href="/login" className="group transition duration-300">
                    <span className="font-bold relative text-sky-600">
                        Login Now
                        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-sky-600 transform origin-bottom scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                    </span>
                </Link>
            </p>
        </>
    );
};

export default RegisterPage;
