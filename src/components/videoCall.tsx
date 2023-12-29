"use client"
import { useEffect, useRef, useState } from "react";

const VideoCall = () => {
  const [peerConnection, setPeerConnection] = useState(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [roomId, setRoomId] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  async function openUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia(
        {video: true, audio: true});
    setLocalStream(stream);
    // localVideoRef.current.srcObject = localStream;
    setRemoteStream(new MediaStream())
    remoteVideoRef.current.srcObject = remoteStream;
  
    console.log('Stream:', stream);
  }

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      console.log("localStream", localStream);
      
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <section className=" flex flex-col">
      <div id="videos">
        <video id="localVideo" ref={localVideoRef} muted autoPlay playsInline></video>
        <video id="remoteVideo" ref={remoteVideoRef} autoPlay playsInline></video>
      </div>
      <div>
        <button id="cameraBtn" className=" bg-blue-500" onClick={openUserMedia} >Open Camera</button>
      </div>
    </section>
  )
}

export default VideoCall;