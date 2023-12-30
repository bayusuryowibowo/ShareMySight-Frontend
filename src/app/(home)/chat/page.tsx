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
        <>
            <input
                type="text"
                value={currentMessage}
                onChange={handleOnChange}
            />
            <button onClick={handleConnect}>connect</button>
            <button onClick={handleSendMessage}>send</button>
            <button onClick={handleDisconnect}>disconnect</button>
            <div>
                {messageHistory.map((msg, index) => (
                    <div key={index}>
                        <span>{msg?.user?.email}: </span>
                        {msg.message}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Chat;
