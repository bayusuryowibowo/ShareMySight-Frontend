"use client";
import { SocketContext } from "@/context/socketContext";
import { useContext, useEffect, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";

type CallUserRequest = { from: string; name: string; signal: Peer.SignalData };

export default function RandomVideoCallPage() {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    setName,
    callRandomUser,
    setStream,
    socket,
    setMe,
    setCall,
    setCallAccepted,
    connectionRef,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    const socket = io("ws://localhost:8081");

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
        // if (from && name && signal) {
        //   setCallAccepted(true);

        //   const peer = new Peer({ initiator: false, trickle: false, stream });

        //   peer.on("signal", (data) => {
        //     socket.emit("answerCall", { signal: data, to: call.from });
        //   });

        //   peer.on("stream", (currentStream) => {
        //     if (userVideo.current) {
        //       userVideo.current.srcObject = currentStream;
        //     }
        //   });

        //   peer.signal(call.signal);

        //   connectionRef.current = peer;
        // }
      }
    );
  }, []);

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
        onClick={() => callRandomUser(idToCall)}
      >
        Start Random Call
      </button>
    </main>
  );
}
