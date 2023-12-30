"use client";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp, CompatClient } from "@stomp/stompjs";
import axios from "axios";

interface MessageHistory {
    username: string;
    content: string;
}

const Chat = () => {
    const [stompClient, setStompClient] = useState<CompatClient | null>(null);
    const [isConnected, setIsConnected] = useState<Boolean>(false);
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);

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

    const test = () => {
        axios({
            url: "http://localhost:8080/test",
            withCredentials: true,
        })
            .then((response) => {
                // handle the response
            })
            .catch((error) => {
                // handle the error
            });
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
                    <div key={index}>{msg.content}</div>
                ))}
            </div>
            <button onClick={test}>test</button>
        </>
    );
};

export default Chat;
