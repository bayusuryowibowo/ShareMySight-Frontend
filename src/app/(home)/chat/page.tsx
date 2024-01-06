"use client";
import { useEffect, useRef, useState, CSSProperties } from "react";
import SockJS from "sockjs-client";
import { Stomp, CompatClient } from "@stomp/stompjs";
import useFetch from "@/hooks/useFetch";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import { MoonLoader } from "react-spinners";

const Chat = () => {
    const [stompClient, setStompClient] = useState<CompatClient | null>(null);
    const [isConnected, setIsConnected] = useState<Boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const { data, setData, loading } = useFetch("/chat");
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isConnected) {
            const socket = new SockJS(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/ws`
            );
            const stomp = Stomp.over(socket);

            stomp.connect({}, () => {
                setStompClient(stomp);
                setIsConnected(true);

                stomp.subscribe("/topic/messages", (response) => {
                    const newMessage = JSON.parse(response.body);
                    setData((prevMessages: any) => [
                        ...prevMessages,
                        newMessage,
                    ]);
                });
            });

            return () => {
                if (stompClient) {
                    stompClient.disconnect();
                }
            };
        }
    }, [isConnected]);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop =
                scrollContainerRef.current.scrollHeight;
        }
    }, [data]);

    useEffect(() => {
        setIsConnected(true);
    }, []);

    const handleOnChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setCurrentMessage((e.target as HTMLInputElement).value);
    };

    const handleSendMessage = () => {
        if (stompClient && currentMessage.trim() !== "") {
            stompClient.send(
                "/app/chat",
                {},
                JSON.stringify({ message: currentMessage })
            );
            setCurrentMessage("");
            if (textArea.current) {
                textArea.current.value = "";
            }
        }
    };

    return (
        <div className="p-[30px] grow h-chatbox">
            <div className="shadow-inner h-full rounded-[20px] border-2 border-solid flex flex-col bg-white">
                <div className="h-[50px] rounded-tl-[20px] rounded-tr-[20px] w-full bg-midnight-blue text-white flex items-center justify-center">
                    <p className="p-3"> Ask Volunteers What you need . . .</p>
                </div>
                <div
                    className="grow p-5 overflow-y-scroll scrollbar"
                    ref={scrollContainerRef}
                >
                    {!loading ? (
                        data.map((el: any, index: any) => {
                            if (
                                el.user.email !==
                                localStorage.getItem("username")
                            ) {
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-5 mb-5"
                                    >
                                        {el.user.role === "volunteer" ? (
                                            <img
                                                src="/volunteer.png"
                                                alt="volunteer profile"
                                                className="w-10 h-10"
                                            />
                                        ) : (
                                            <AccountCircleIcon className="text-4xl" />
                                        )}

                                        <div className="bg-periwinkle px-5 py-2 rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px]">
                                            <div className="font-bold">
                                                {el.user.email}
                                            </div>
                                            <div>{el.message}</div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-5 mb-5 justify-end"
                                    >
                                        <div className="bg-pink-purple px-5 py-2 rounded-tl-[20px] rounded-br-[20px] rounded-bl-[20px] max-w-[50%]">
                                            <div className="font-bold">
                                                {el.user.email}
                                            </div>
                                            <div>{el.message}</div>
                                        </div>

                                        {el.user.role === "volunteer" ? (
                                            <img
                                                src="/volunteer.png"
                                                alt="volunteer profile"
                                                className="w-10 h-10"
                                            />
                                        ) : (
                                            <AccountCircleIcon className="text-4xl" />
                                        )}
                                    </div>
                                );
                            }
                        })
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <MoonLoader
                                color="#303866"
                                loading={loading}
                                size={60}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div>
                    )}
                </div>
                <div className="flex m-5 bg-pink-purple">
                    <textarea
                        className="w-full p-3 resize-none focus:outline-none bg-pink-purple text-dark-purple"
                        placeholder="Send message..."
                        onChange={handleOnChange}
                        ref={textArea}
                    ></textarea>
                    <div className="flex items-center h-full gap-2 p-5">
                        <div onClick={handleSendMessage}>
                            <SendIcon className="text-3xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
