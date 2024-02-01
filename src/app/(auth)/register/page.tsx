"use client";
import Input from "@/components/input";
import Link from "next/link";
import { ChangeEvent, useMemo, useState } from "react";
import { UserRole } from "./role";
import SelectOption from "@/components/selectOption";
import ErrorHandler from "@/utils/errorHandling";
import { apiClient } from "@/utils/axios";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";

interface UserData {
    email: string;
    password: string;
    role: UserRole;
    languageId: string;
}

interface LanguageOptions {
    label: string;
    value: string;
}

const RegisterPage = () => {
    const router = useRouter();
    const { data } = useFetch("/language");
    const dataOptions: LanguageOptions[] = useMemo(
        () =>
            data.map((language: { id: string; languageName: string }) => ({
                label: language.languageName,
                value: language.id,
            })),
        [data]
    );

    const [userData, setUserData] = useState<UserData>({
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

    const handleSelectChange = (data: {
        name: string | undefined;
        value: unknown;
    }) => {
        const name = data.name;
        const value = data.value;

        if (typeof name === "string") {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleRegister = async (
        e: React.MouseEvent<HTMLButtonElement>
    ): Promise<void> => {
        try {
            await apiClient.post("/register", userData);
            router.push("/login");
        } catch (error: any) {
            ErrorHandler.handleError(error);
        }
    };

    return (
        <div className="bg-white w-[90%] m-h-3/5 rounded-[30px] shadow-md flex m-2 md:w-[70%] xl:p-4 z-10">
            <p className="border-r-2 flex justify-center items-center">
                <img
                    src="welcome.png"
                    alt="welcome"
                    className="object-fit-cover hidden lg:block lg:w-[600px] xl:w-[700px] 2xl:w-[800px]"
                />
            </p>
            <div className="p-5 w-full">
                <div className="p-2">
                    <div className="text-center font-bold text-3xl text-dark-purple xl:text-4xl">
                        Register
                    </div>
                    <p className="text-center mt-3 text-dark-purple text-sm lg:text-md xl:text-[16px]">
                        Hey, Enter your details to get sign up your account
                    </p>
                    <div className="flex justify-center gap-8 my-8">
                        <div className="max-w-[150px] w-full">
                            <div
                                className={`cursor-pointer outline-dotted p-4 rounded-md relative ${
                                    userData.role === UserRole.Volunteer &&
                                    "border-2 border-solid border-dark-purple outline-none"
                                }`}
                            >
                                <Input
                                    type="radio"
                                    name="role"
                                    value={UserRole.Volunteer}
                                    onChange={handleOnChange}
                                    inputClassName="absolute inset-0 opacity-0"
                                    error={false}
                                />
                                <img
                                    src="https://media-public.canva.com/JbmNs/MAFIVoJbmNs/1/tl.png"
                                    alt="Role: volunteer"
                                    className="object-cover h-[60px] mx-auto xl:h-[80px]"
                                />
                            </div>
                            <p className="text-center mt-2 text-dark-purple text-sm">
                                I&apos;m a volunteer
                            </p>
                        </div>
                        <div className="max-w-[150px] w-full">
                            <div
                                className={`cursor-pointer outline-dotted p-4 rounded-md relative ${
                                    userData.role === UserRole.NeedAssistance &&
                                    "border-2 border-solid border-dark-purple outline-none"
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
                                    className="object-cover h-[60px] mx-auto xl:h-[80px]"
                                ></img>
                            </div>
                            <p className="text-center mt-2 text-dark-purple text-sm">
                                I need assistance
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col mt-[30px] gap-4">
                        <Input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            onChange={handleOnChange}
                            error={false}
                            inputClassName="bg-pink-purple rounded-md py-2 px-3 w-full authInput focus:outline-none text-dark-purple"
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="Enter Your Password"
                            onChange={handleOnChange}
                            error={false}
                            inputClassName="bg-pink-purple rounded-md py-2 px-3  w-full authInput focus:outline-none text-dark-purple"
                        />
                        <SelectOption
                            options={dataOptions}
                            name="languageId"
                            placeholder="Select Language"
                            className="focus:outline-none"
                            handleSelectChange={handleSelectChange}
                        />
                    </div>
                    <button
                        className="w-full bg-dark-purple py-2 font-bold rounded-md mt-[35px] text-pink-purple text-sm xl:h-[40px]"
                        onClick={handleRegister}
                    >
                        Register
                    </button>
                    <p className="text-center text-dark-purple text-sm mt-3 lg:text-md xl:text-[16px] xl:mt-[20px]">
                        Already have account?{" "}
                        <Link
                            href="/login"
                            className="group transition duration-300 text-lavender"
                        >
                            <span className="font-bold relative">
                                Login Now
                                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-lavender transform origin-bottom scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
