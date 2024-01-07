"use client";
import Button from "@/components/button";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Socket, io } from "socket.io-client";
import CallIcon from "@mui/icons-material/Call";
import { CallEnd } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";

type Call = {
    isReceivingCall: boolean;
    from: string;
    name: string;
    signal: Peer.SignalData;
};

type CallUserRequest = { from: string; name: string; signal: Peer.SignalData };

export default function RandomVideoCallPage() {
    const [callAccepted, setCallAccepted] = useState<boolean>(false);
    const [callEnded, setCallEnded] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | undefined>();
    const [name, setName] = useState<string>("");
    const [call, setCall] = useState<Call>({
        isReceivingCall: false,
        from: "",
        name: "",
        signal: {} as Peer.SignalData,
    });
    const [me, setMe] = useState<string>("");

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance | undefined>();
    const [socket, setSocket] = useState<Socket>();
    const [isCallMatching, setIsCallMatching] = useState<boolean>(false);

    const setAsyncStreamState = async (newState: MediaStream) => {
        setStream(newState);
        return Promise.resolve();
    };

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(async (currentStream) => {
                await setAsyncStreamState(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            });
    }, []);

    useEffect(() => {
        if (!socket && stream) {
            const s = io("https://sharemysight.productapic1.com", {
                reconnection: false,
                transports: ["websocket"],
                withCredentials: true,
            });

            setSocket(s);
            s.on("me", (id: string) => setMe(id));

            s.on(
                "startRandomCall",
                ({ from, name: callerName, signal }: CallUserRequest) => {
                    setCall({
                        isReceivingCall: true,
                        from,
                        name: callerName,
                        signal,
                    });
                    if (from && signal) {
                        setIsCallMatching(false);
                        setCallAccepted(true);
                        setCallEnded(false);

                        const peer = new Peer({
                            initiator: false,
                            trickle: false,
                            stream: stream,
                        });

                        peer.on("signal", (data) => {
                            s.emit("goingRandomCall", {
                                signal: data,
                                to: from,
                            });
                        });

                        peer.on("stream", (currentStream) => {
                            if (userVideo.current) {
                                userVideo.current.srcObject = currentStream;
                            }
                        });

                        peer.signal(signal);

                        connectionRef.current = peer;
                    }
                }
            );

            return () => {
                if (socket) {
                    s.removeListener("callAccepted", handleCallAccepted);
                    s.removeAllListeners("me");
                    s.removeAllListeners("startRandomCall");
                    s.removeAllListeners("endcall");

                    if (call && callAccepted && !callEnded && !isCallMatching) {
                        s.emit("endCall", {
                            to: call.from,
                        });
                    }

                    s.disconnect();

                    if (connectionRef.current) {
                        connectionRef.current.removeAllListeners("signal");
                        connectionRef.current.removeAllListeners("stream");
                        connectionRef.current.destroy();
                        connectionRef.current = undefined;
                    }
                }
            };
        }
    }, [stream]);

    const handleCallAccepted = ({
        from,
        signal,
        callerName,
    }: {
        from: string;
        signal: Peer.SignalData;
        callerName: string;
    }) => {
        setCall({
            isReceivingCall: false,
            from: from,
            name: "",
            signal: {} as Peer.SignalData,
        });

        if (socket && connectionRef.current) {
            setCallEnded(false);
            setIsCallMatching(false);
            setCallAccepted(true);

            connectionRef.current.signal(signal);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.on("endCall", () => {
                if (connectionRef.current) {
                    connectionRef.current.removeAllListeners("signal");
                    connectionRef.current.removeAllListeners("stream");
                    connectionRef.current.destroy();
                    connectionRef.current = undefined;
                    setCallEnded(true);
                    setCallAccepted(false);
                    setCall({
                        isReceivingCall: false,
                        from: "",
                        name: "",
                        signal: {} as Peer.SignalData,
                    });
                    socket.off("callAccepted");
                }
            });
            return () => {
                socket.off("endCall");
            };
        }
    }, [socket]);

    const callRandomUser = () => {
        if (socket) {
            setIsCallMatching(true);
            const peer = new Peer({ initiator: true, trickle: false, stream });

            peer.on("signal", (data) => {
                socket.emit("startRandomCall", {
                    signalData: data,
                    from: me,
                    name,
                });
            });

            peer.on("stream", (currentStream) => {
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }
            });

            socket.on("callAccepted", handleCallAccepted);

            connectionRef.current = peer;
        }
    };

    const leaveCall = () => {
        if (
            socket &&
            call &&
            callAccepted &&
            !callEnded &&
            !isCallMatching &&
            connectionRef.current
        ) {
            connectionRef.current.removeAllListeners("signal");
            connectionRef.current.removeAllListeners("stream");
            connectionRef.current.destroy();
            connectionRef.current = undefined;
            console.log("to: call.from >>> ", call.from);

            socket.emit("endCall", {
                to: call.from,
            });
            setCallEnded(true);
            setCallAccepted(false);
            setCall({
                isReceivingCall: false,
                from: "",
                name: "",
                signal: {} as Peer.SignalData,
            });
            socket.off("callAccepted");
        } else if (socket && !callAccepted && callEnded && isCallMatching) {
            socket.emit("cancelCall");
            setIsCallMatching(false);
        }
    };

    return (
        <div className="p-[30px] grow bg-pale-purple h-chatbox">
            <div className="shadow-inner h-full rounded-[20px] border-2 border-solid flex flex-col bg-midnight-blue">
                <div className=" flex flex-row gap-5 h-full p-[25px] pb-0">
                    {/* my video */}
                    {stream ? (
                        <video
                            playsInline
                            muted
                            ref={myVideo}
                            autoPlay
                            className="h-full w-1/2 z-50"
                            height={600}
                            width={600}
                        />
                    ) : (
                        <div className="h-full w-1/2 bg-black rounded-tl-[10px]"></div>
                    )}

                    {/* user's video */}
                    {callAccepted && !callEnded ? (
                        <video
                            playsInline
                            ref={userVideo}
                            autoPlay
                            className="h-full w-1/2 z-50"
                            height={600}
                            width={600}
                        />
                    ) : (
                        <div className="h-full w-1/2 bg-black rounded-tr-[10px]"></div>
                    )}
                </div>
                <div className=" flex flex-row gap-5 justify-end items-center pr-[25px] py-[15px]">
                    {!callAccepted && (
                        <Button
                            disabled={isCallMatching}
                            icon={
                                isCallMatching ? (
                                    <RefreshIcon className="animate-spin" />
                                ) : (
                                    <CallIcon />
                                )
                            }
                            className={
                                "flex flex-row justify-center gap-5 p-2 rounded w-40 " +
                                (isCallMatching
                                    ? " bg-gray-600 text-white"
                                    : "bg-green-500 hover:bg-green-600")
                            }
                            onClick={callRandomUser}
                            text={isCallMatching ? "Matching..." : "Call"}
                        />
                    )}
                    {(isCallMatching || callAccepted) && (
                        <Button
                            icon={<CallEnd />}
                            className="flex flex-row justify-center gap-5 p-2 rounded bg-red-500 hover:bg-red-600 w-40"
                            onClick={leaveCall}
                            text={callAccepted ? "End Call" : "Cancel"}
                            disabled={false}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/*

*/
