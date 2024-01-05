"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { apiClient } from "@/utils/axios";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface Request {
    text: string;
    image: File | null;
}

const AIChat = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);
    const [chatHistory, setChatHistory] = useFetch("/ai-chat");
    const [currentRequest, setCurrentRequest] = useState<Request>({
        text: "",
        image: null,
    });
    const [currentPromptId, setCurrentPromptId] = useState<number | null>(null);

    const uploadImage = async () => {
        const formData = new FormData();

        if (currentRequest.image) {
            formData.append("file", currentRequest.image);
        }

        formData.append("text", currentRequest.text);

        try {
            //first request to upload the image
            const uploadResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/ai-chat/upload`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setChatHistory([...chatHistory, uploadResponse?.data?.data]);
            setCurrentPromptId(uploadResponse?.data?.data?.id);
        } catch (error) {
            console.log(error);
        }
    };

    const getAIResponse = async () => {
        if (currentPromptId == null) return;

        try {
            // second request to get the openAI response
            const aiPromptResponse = await apiClient.post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/ai-chat`,
                {
                    promptId: currentPromptId,
                }
            );

            console.log(aiPromptResponse);

            // Update the state with the modified chat data
            const updatedChatHistory = chatHistory.map(
                (chat: any, index: number) =>
                    index === chatHistory.length - 1
                        ? {
                              ...chat,
                              description:
                                  aiPromptResponse?.data?.data?.description,
                          }
                        : chat
            );

            console.log(updatedChatHistory);

            setChatHistory(updatedChatHistory);
        } catch (error) {
            console.log(error);
        }
    };

    const handleTextOnChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setCurrentRequest({
            ...currentRequest,
            text: (e.target as HTMLInputElement).value,
        });
    };

    const handleImageOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCurrentRequest({
                ...currentRequest,
                image: e.target.files[0],
            });
        }
    };

    useEffect(() => {
        getAIResponse();
    }, [currentPromptId]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className="p-[30px] grow h-chatbox">
            <div className="shadow-inner h-full rounded-[20px] border-2 border-solid flex flex-col bg-white">
                <div className="rounded-tl-[20px] rounded-tr-[20px] w-full bg-midnight-blue text-white flex items-center justify-center">
                    <p className="p-3">
                        {" "}
                        Upload image to your virtual AI assistance . . .
                    </p>
                </div>
                <div
                    className="grow p-5 overflow-y-scroll scrollbar"
                    ref={scrollContainerRef}
                >
                    {chatHistory.map((el: any, index: number) => (
                        <div key={index}>
                            <div className="flex gap-5 mb-5 justify-end">
                                <div className="bg-pink-purple p-2 rounded-tl-[10px] rounded-bl-[10px] rounded-br-[10px] flex flex-col max-w-[250px]">
                                    <img
                                        src={el?.imageUrl}
                                        className="max-h-[250px]"
                                        style={{ objectFit: "cover" }}
                                    ></img>
                                    <p className="text-dark-purple text-end mt-1">
                                        {el?.text}
                                    </p>
                                </div>
                                <AccountCircleIcon className="text-4xl" />
                            </div>

                            {el?.description && (
                                <div className="flex gap-5 mb-5">
                                    <img
                                        className="_7_i_XA w-10 h-10"
                                        crossOrigin="anonymous"
                                        src="https://media-public.canva.com/N_D8M/MAFgqzN_D8M/1/tl.png"
                                        draggable="false"
                                        alt="Artificial Intelligence, Technology, Ai, Chip, Science"
                                    />
                                    <div className="bg-[#E9EAF6] px-5 py-2 rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] max-w-[50%]">
                                        {el.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="border-2 border-solid flex m-5 bg-pink-purple">
                    <textarea
                        className="w-full p-3 resize-none focus:outline-none bg-pink-purple text-dark-purple"
                        placeholder="Send message..."
                        ref={textArea}
                        onChange={handleTextOnChange}
                    ></textarea>
                    <div className="p-3 flex items-center h-full">
                        <div className="px-3 py-1 rounded-md w-[50px] relative flex items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                title=" "
                                className="opacity-0 absolute inset-0"
                                onChange={handleImageOnChange}
                                accept="image/png, image/gif, image/jpeg"
                            />
                            <AttachFileIcon className="text-3xl" />
                        </div>
                        <div
                            className="bg-beige px-3 py-1 rounded-md"
                            onClick={uploadImage}
                        >
                            <SendIcon className="text-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;
