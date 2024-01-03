"use client";
import { SocketContext } from "@/context/socketContext";
import { useContext, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { Socket, io } from "socket.io-client";

type Call = {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: Peer.SignalData;
};

type CallUserRequest = { from: string; name: string; signal: Peer.SignalData };

const socket = io("ws://localhost:8081", {
  autoConnect: false
});

export default function RandomVideoCallPage() {
  const [idToCall, setIdToCall] = useState("");
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

  const myVideo = useRef<HTMLVideoElement | undefined>();
  const userVideo = useRef<HTMLVideoElement | undefined>();
  const connectionRef = useRef<Peer.Instance | undefined>();
  // const [socket, setSocket] = useState<Socket | null>(null);
  // const socket = useRef<Socket | null>(null)
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
  
    setIsSocketConnected(true);
  
    // ... (socket.on dan seterusnya)
    socket.on("me", (id: string) => setMe(id));

      socket.on(
        "callUser",
        ({ from, name: callerName, signal }: CallUserRequest) => {
          setCall({ isReceivingCall: true, from, name: callerName, signal });
        }
      );

      socket.on(
        "startRandomCall",
        ({ from, name: callerName, signal }: CallUserRequest) => {
          setCall({ isReceivingCall: true, from, name: callerName, signal });
          if (from && name && signal) {
            setCallAccepted(true);

            const peer = new Peer({ initiator: false, trickle: false, stream });

            peer.on("signal", (data) => {
              socket.emit("goingRandomCall", { signal: data, to: call.from });
            });

            peer.on("stream", (currentStream) => {
              if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
              }
            });

            peer.signal(call.signal);

            connectionRef.current = peer;
          }
        }
      );

    return () => {
      if (socket.connected) {
        socket.disconnect();
        setIsSocketConnected(false);
      }
    };
  }, []);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });
  }, []);



  const callRandomUser = () => {
    if (socket) {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (data) => {
        console.log("signal >>>>>>>>", data);
        console.log("socket current", socket);

        socket.emit("startRandomCall", {
          userToCall: "",
          signalData: {},
          from: me,
          name,
        });
      });

      peer.on("stream", (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });

      socket.on("callAccepted", (signal) => {
        setCallAccepted(true);

        peer.signal(signal);
      });

      connectionRef.current = peer;
    }
  }

  return (
    <main>
      {/* my video */}
      {stream && (
        <video playsInline muted ref={myVideo} autoPlay width="600" />
      )}

      {/* user's video */}

      {callAccepted && !callEnded && (
        <video playsInline ref={userVideo} autoPlay width="600" />
      )}
      <form>
        <label htmlFor="">Username</label>
        <input type="text" name="" id="" value={name}
          onChange={(e) => setName(e.target.value)} />
      </form>
      <button
        onClick={callRandomUser}
      >
        Start Random Call
      </button>
    </main>
  );
}
