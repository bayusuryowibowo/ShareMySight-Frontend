"use client";
import { useMemo, useRef, useState } from "react";

const VideoCall = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [roomId, setRoomId] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  async function openUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    setRemoteStream(new MediaStream());
  }

  useMemo(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useMemo(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <section className=" flex flex-col">
      <div id="videos">
        <video
          id="localVideo"
          ref={localVideoRef}
          muted
          autoPlay
          playsInline
        ></video>
        <video
          id="remoteVideo"
          ref={remoteVideoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div className="flex flex-row gap-5">
        <button id="cameraBtn" className=" bg-blue-500" onClick={openUserMedia}>
          Open Camera
        </button>
        <button id="start" className=" bg-blue-500">Start</button>
      </div>
    </section>
  );
};

export default VideoCall;
