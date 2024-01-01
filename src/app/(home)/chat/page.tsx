"use client";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp, CompatClient } from "@stomp/stompjs";
import useFetch from "@/hooks/useFetch";

const Chat = () => {
    const [stompClient, setStompClient] = useState<CompatClient | null>(null);
    const [isConnected, setIsConnected] = useState<Boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageHistory, setMessageHistory] = useFetch("/chat");
    console.log(messageHistory);

    useEffect(() => {
        if (isConnected) {
            const socket = new SockJS("http://localhost:8080/ws");
            const stomp = Stomp.over(socket);

            stomp.connect({}, () => {
                setStompClient(stomp);
                setIsConnected(true);

                stomp.subscribe("/topic/messages", (response) => {
                    const newMessage = JSON.parse(response.body);
                    setMessageHistory((prevMessages) => [
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

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentMessage(e.target.value);
    };

    const handleConnect = () => {
        setIsConnected(true);
    };

    const handleDisconnect = () => {
        if (stompClient) {
            stompClient.disconnect();
            setStompClient(null);
            setIsConnected(false);
        }
    };

    const handleSendMessage = () => {
        if (stompClient && currentMessage.trim() !== "") {
            stompClient.send(
                "/app/chat",
                {},
                JSON.stringify({ content: currentMessage })
            );
            setCurrentMessage("");
        }
    };

    return (
        <div className="p-[40px] grow bg-[#EDF2F6]">
            <div className="shadow-inner h-full rounded-[20px] border-2 border-solid flex flex-col bg-white">
                <div className="h-[75px] rounded-tl-[20px] rounded-tr-[20px] w-full bg-[#76bca2]"></div>
                <div className="grow p-5 bg-white">
                    {messageHistory.map((el, index) => (
                        <div key={index}>
                            {el.user.email}: {el.message}
                        </div>
                    ))}
                </div>
                <div className="h-[100px] border-2 border-solid flex m-5 bg-white">
                    <textarea
                        className="w-full p-3 resize-none focus:outline-none"
                        placeholder="Send message..."
                    ></textarea>
                    <div className="p-3 flex h-[60px] gap-2">
                        <div className="px-3 py-1 rounded-md w-[50px] relative flex items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                title=" "
                                className="opacity-0 absolute inset-0"
                            />
                            <svg
                                stroke="currentColor"
                                fill="currentColor"
                                stroke-width="0"
                                viewBox="0 0 512 512"
                                className="css-119zpey"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path>
                            </svg>
                        </div>
                        <button className="bg-beige px-3 py-1 rounded-md">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
