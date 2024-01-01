"use client";
import db from "@/lib/firebaseConfig";
import videoCallService from "@/lib/services/videoCallSingeton";
import configuration from "@/lib/webRTCConfiguration";
import { CollectionReference, DocumentReference, addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { useMemo, useRef, useState } from "react";

const VideoCall = () => {
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState({
    startRandomCallBtn: false,
  });

  async function openUserMedia() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    setRemoteStream(new MediaStream());
  }

  const registerPeerConnectionListeners = (newRTCPeerConnection: RTCPeerConnection): void => {
    newRTCPeerConnection.addEventListener("icegatheringstatechange", () => {
      console.log(
        `ICE gathering state changed: ${newRTCPeerConnection.iceGatheringState}`
      );
    });

    newRTCPeerConnection.addEventListener("connectionstatechange", () => {
      console.log(`Connection state change: ${newRTCPeerConnection.connectionState}`);
    });

    newRTCPeerConnection.addEventListener("signalingstatechange", () => {
      console.log(`Signaling state change: ${newRTCPeerConnection.signalingState}`);
    });

    newRTCPeerConnection.addEventListener("iceconnectionstatechange ", () => {
      console.log(
        `ICE connection state change: ${newRTCPeerConnection.iceConnectionState}`
      );
    });
  }

  async function startRandomCall() {
    setIsButtonDisabled({ ...isButtonDisabled, startRandomCallBtn: true });
    const roomsCol = collection(db, "rooms");
    const videoCallRoom = await videoCallService.getRandomVideoCallRoom();
    if (videoCallRoom) {
      console.log(videoCallRoom)
      joinRoomById(roomsCol, videoCallRoom.roomId);
      return;
    }

    const roomRef: DocumentReference = doc(roomsCol);
    console.log("Create PeerConnection with configuration: ", configuration);
    const newRTCPeerConnection = new RTCPeerConnection(configuration);
    setPeerConnection(newRTCPeerConnection);

    registerPeerConnectionListeners(newRTCPeerConnection);

    localStream?.getTracks().forEach((track) => {
      newRTCPeerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const callerCandidatesCollection = collection(roomRef, "callerCandidates");

    newRTCPeerConnection.addEventListener("icecandidate", async (event) => {
      if (!event.candidate) {
        console.log("Got final candidate!");
        return;
      }
      console.log("Got candidate: ", event.candidate);
      await addDoc(callerCandidatesCollection, event.candidate.toJSON())
    });
    // Code for collecting ICE candidates above

    // Code for creating a room below
    try {
      const offer = await newRTCPeerConnection.createOffer();
      await newRTCPeerConnection.setLocalDescription(offer);
      console.log("Created offer:", offer);

      if (offer && offer.type && offer.sdp) {
        const roomWithOffer = {
          offer: {
            type: offer.type,
            sdp: offer.sdp,
          },
        };
        await setDoc(roomRef, roomWithOffer);
        setRoomId(roomRef.id);
        await videoCallService.addGeneratedVideoCallRoom(roomRef.id);
        console.log(`New room created with SDP offer. Room ID: ${roomRef.id}`);
      } else {
        console.error("Invalid offer");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
    }

    // Code for creating a room above

    newRTCPeerConnection.addEventListener("track", (event) => {
      console.log("Got remote track:", event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        console.log("Add a track to the remoteStream:", track);
        remoteStream?.addTrack(track);
      });
    });

    const snapshot = await getDoc(roomRef);
    const data = snapshot.data();

    if (!newRTCPeerConnection.currentRemoteDescription && data && data.answer) {
      console.log("Got remote description: ", data.answer);
      const rtcSessionDescription = new RTCSessionDescription(data.answer);
      await newRTCPeerConnection.setRemoteDescription(rtcSessionDescription);
    }
    // Listening for remote session description above

    // Listen for remote ICE candidates below
    const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

    const calleeSnapshot = await getDocs(calleeCandidatesCollection);
    calleeSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
      newRTCPeerConnection.addIceCandidate(new RTCIceCandidate(data));
    });

    // Listen for remote ICE candidates above
  }

  async function joinRoomById(roomsCol: CollectionReference, roomId: string) {
    const roomRef = doc(roomsCol, roomId);
    const roomSnapshot = await getDoc(roomRef);
    console.log('Got room:', roomSnapshot.exists);

    if (roomSnapshot.exists()) {
      console.log('Create PeerConnection with configuration: ', configuration);
      const newRTCPeerConnection = new RTCPeerConnection(configuration);
      setPeerConnection(newRTCPeerConnection);

      registerPeerConnectionListeners(newRTCPeerConnection);
      localStream?.getTracks().forEach(track => {
        newRTCPeerConnection.addTrack(track, localStream);
      });

      // Code for collecting ICE candidates below
      const calleeCandidatesCollection = collection(roomRef, "calleeCandidates");

      const calleeSnapshot = await getDocs(calleeCandidatesCollection);
      calleeSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        newRTCPeerConnection.addIceCandidate(new RTCIceCandidate(data));
      });
      // Code for collecting ICE candidates above

      newRTCPeerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          remoteStream?.addTrack(track);
        });
      });

      // Code for creating SDP answer below
      const offer = roomSnapshot.data().offer;
      console.log('Got offer:', offer);
      await newRTCPeerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await newRTCPeerConnection.createAnswer();
      console.log('Created answer:', answer);
      await newRTCPeerConnection.setLocalDescription(answer);

      const roomWithAnswer = {
        offer,
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await setDoc(roomRef, roomWithAnswer);
      setRoomId(roomRef.id);
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      const callerCandidatesCollection = collection(roomRef, "callerCandidates");

      newRTCPeerConnection.addEventListener("icecandidate", async (event) => {
        if (!event.candidate) {
          console.log("Got final candidate!");
          return;
        }
        console.log("Got candidate: ", event.candidate);
        await addDoc(callerCandidatesCollection, event.candidate.toJSON())
      });
      // Listening for remote ICE candidates above
    }
  }

  useMemo(() => {
    if (localStream && localVideoRef.current) {
      (localVideoRef.current as HTMLVideoElement).srcObject = localStream;
    }
  }, [localStream]);

  useMemo(() => {
    if (remoteStream && remoteVideoRef.current) {
      (remoteVideoRef.current as HTMLVideoElement).srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <section className=" flex flex-col">
      <div id="videos" className=" flex flex-row">
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
        <button
          id="startRandomCallBtn"
          onClick={startRandomCall}
          disabled={isButtonDisabled.startRandomCallBtn}
          className=" bg-blue-500"
        >
          Start
        </button>
      </div>
    </section>
  );
};

export default VideoCall;
