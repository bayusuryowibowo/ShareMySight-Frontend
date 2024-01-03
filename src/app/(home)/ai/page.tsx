"use client";
import { useRef, useState } from "react";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const AIChat = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [chatHistory, setChatHistory] = useFetch("/ai-chat");
    const [imageSelected, setImageSelected] = useState<File | null>(null);

    const uploadImage = async () => {
        const formData = new FormData();

        if (imageSelected) {
            formData.append("file", imageSelected);
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/ai-chat`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Image uploaded successfully");
        } catch (error) {
            console.log("Error uploading file: ", error);
        }
    };

    return (
        <div className="p-[30px] grow bg-[#F6F6F6] h-chatbox">
            <div className="shadow-inner h-full rounded-[20px] border-2 border-solid flex flex-col bg-white">
                <div className="h-[50px] rounded-tl-[20px] rounded-tr-[20px] w-full bg-[#333449] text-white flex items-center justify-center">
                    Upload image to your virtual AI assistance . . .
                </div>
                <div
                    className="grow p-5 overflow-y-scroll scrollbar"
                    ref={scrollContainerRef}
                >
                    {chatHistory.map((el: any, index: number) => (
                        <>
                            <div
                                key={index}
                                className="flex gap-5 mb-5 justify-end"
                            >
                                <img
                                    src={el.imageUrl}
                                    className="max-w-[250px] max-h-[250px]"
                                ></img>
                                <AccountCircleIcon className="text-4xl" />
                            </div>
                            <div
                                key={index}
                                className="flex gap-5 mb-5 justify-start"
                            >
                                <AccountCircleIcon className="text-4xl" />
                                <div className="bg-[#E9EAF6] px-5 py-2 rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px]">
                                    <div>{el.description}</div>
                                </div>
                            </div>
                        </>
                    ))}
                </div>
                <div className="border-2 border-solid flex m-5 bg-white">
                    <textarea
                        className="w-full p-3 resize-none focus:outline-none"
                        placeholder="Send message..."
                        ref={textArea}
                    ></textarea>
                    <div className="p-3 flex h-[60px] gap-2">
                        <div className="px-3 py-1 rounded-md w-[50px] relative flex items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                title=" "
                                className="opacity-0 absolute inset-0"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setImageSelected(e.target.files[0]);
                                    }
                                }}
                            />
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                strokeWidth="0"
                                viewBox="0 0 512 512"
                                className="css-119zpey"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path>
                            </svg>
                        </div>
                        <button
                            className="bg-beige px-3 py-1 rounded-md"
                            onClick={uploadImage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
