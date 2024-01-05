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
      const s = io("http://localhost:8081", {
        reconnection: false,
        transports: ["websocket"],
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
            setCallEnded(false)

            const peer = new Peer({
              initiator: false,
              trickle: false,
              stream: stream,
            });

            peer.on("signal", (data) => {
              console.log("goingRandomCall : signal = ", data);

              s.emit("goingRandomCall", {
                signal: data,
                to: from,
              });
            });

            peer.on("stream", (currentStream) => {
              if (userVideo.current) {
                console.log(
                  "from startRandomCall stream userVideo >>>",
                  currentStream
                );
                userVideo.current.srcObject = currentStream;
              }
            });

            console.log("call.signal >>>>>>>", signal);

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

  const handleCallAccepted = (signal: Peer.SignalData) => {
    if (socket && connectionRef.current) {
      console.log("callAccept >>>>>>>>", signal);

      setCallEnded(false)
      setIsCallMatching(false);
      setCallAccepted(true);

      connectionRef.current.signal(signal);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("endCall", () => {
        if (connectionRef.current) {
          console.log("Incoming endCall");
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
    console.log("button call ketrigger");

    if (socket) {
      setIsCallMatching(true);
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (data) => {
        console.log("signal >>> ", data);

        socket.emit("startRandomCall", {
          signalData: data,
          from: me,
          name,
        });
      });

      peer.on("stream", (currentStream) => {
        console.log("stream userVideo >>>", currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      socket.on("callAccepted", handleCallAccepted);

      connectionRef.current = peer;
    } else {
      console.log("socket undefined");
    }
  };

  const leaveCall = () => {
    console.log(callEnded, isCallMatching, connectionRef.current);
    
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
    } else if (
      socket &&
      !callAccepted &&
      callEnded &&
      isCallMatching
    ) {
      socket.emit("cancelCall");
      setIsCallMatching(false);
    }
  };

  return (
    <div className="p-[30px] grow bg-[#F6F6F6] h-chatbox">
      <div className="shadow-inner h-full rounded-[20px] border-2 border-solid flex flex-col bg-white">
        <div className="h-[50px] rounded-tl-[20px] rounded-tr-[20px] w-full bg-[#333449] text-white flex items-center justify-center">
          Call anyone to get assistance
        </div>
        <div className=" flex flex-row gap-5 justify-center">
          {/* my video */}
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-[600px]"
            />
          )}

          {/* user's video */}
          {callAccepted && !callEnded && (
            <video playsInline ref={userVideo} autoPlay width="600" />
          )}
        </div>
        <div className=" flex flex-row gap-5 justify-end items-center p-1 pr-5">
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
