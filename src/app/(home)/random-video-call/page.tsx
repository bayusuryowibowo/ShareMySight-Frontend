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

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance | undefined>();
  const [socket, setSocket] = useState<Socket>();

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

  useEffect(() => {
    const s = io("http://localhost:8081", {
      reconnection: false,
      transports: ["websocket"],
    });

    console.log("first userVideo >>>", userVideo.current);

    setSocket(s);
    s.on("me", (id: string) => setMe(id));
    s.on(
      "callUser",
      ({ from, name: callerName, signal }: CallUserRequest) => {
        setCall({
          isReceivingCall: true,
          from,
          name: callerName,
          signal,
        });
      }
    );

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
          setCallAccepted(true);
        
          // BUG DI SINI, stream undefined
          console.log(
            "stream before instaniate >>> ", stream
          )

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
              console.log("from startRandomCall stream userVideo >>>", currentStream);
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
        s.disconnect();
      }
    };
  }, []);

  const callRandomUser = () => {
    if (socket) {
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


      socket.on("callAccepted", (signal) => {
        console.log("callAccept >>>>>>>>", signal);

        setCallAccepted(true);

        connectionRef.current?.signal(signal);
      });

      connectionRef.current = peer;
    } else {
      console.log("socket undefined")
    }
  };

  return (
    <main>
      <div className=" flex flex-row gap-5">
        {/* my video */}
        {stream && (
          <video playsInline muted ref={myVideo} autoPlay width="600" />
        )}

        {/* user's video */}
        {!callEnded && (
          <video playsInline ref={userVideo} autoPlay width="600" />
        )}
      </div>
      <form>
        <label htmlFor="">Username</label>
        <input
          type="text"
          name=""
          id=""
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </form>
      <button onClick={callRandomUser}>Start Random Call</button>
    </main>
  );
}
