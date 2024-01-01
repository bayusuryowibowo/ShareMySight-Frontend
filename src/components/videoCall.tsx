"use client";
import db from "@/lib/firebaseConfig";
import videoCallService from "@/lib/services/videoCallSingeton";
import configuration from "@/lib/webRTCConfiguration";
import firebase from "firebase/app";
import "firebase/firestore"
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
    const roomRef = await db.collection('rooms').doc();
    const videoCallRoom = await videoCallService.getRandomVideoCallRoom();
    if (videoCallRoom) {
      console.log(videoCallRoom)
      joinRoomById(videoCallRoom.roomId);
      return;
    }

    console.log('Create PeerConnection with configuration: ', configuration);
    const peerConnection = new RTCPeerConnection(configuration);

    registerPeerConnectionListeners(peerConnection);

    localStream?.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const callerCandidatesCollection = roomRef.collection('callerCandidates');

    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      callerCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    // Code for creating a room below
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log('Created offer:', offer);

    const roomWithOffer = {
      'offer': {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await roomRef.set(roomWithOffer);
    const roomId: string = roomRef.id;
    await videoCallService.addGeneratedVideoCallRoom(roomId);
    console.log(`New room created with SDP offer. Room ID: ${roomId}`);
    // Code for creating a room above

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream?.addTrack(track);
      });
    });

    // Listening for remote session description below
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
    // Listening for remote session description above

    // Listen for remote ICE candidates below
    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    // Listen for remote ICE candidates above
  }

  async function joinRoomById(roomId: string) {
    const roomRef = db.collection('rooms').doc(`${roomId}`);
    const roomSnapshot = await roomRef.get();
    console.log('Got room:', roomSnapshot.exists);

    if (roomSnapshot.exists) {
      console.log('Create PeerConnection with configuration: ', configuration);
      const peerConnection = new RTCPeerConnection(configuration);
      registerPeerConnectionListeners(peerConnection);
      localStream?.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });

      // Code for collecting ICE candidates below
      const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
      peerConnection.addEventListener('icecandidate', event => {
        if (!event.candidate) {
          console.log('Got final candidate!');
          return;
        }
        console.log('Got candidate: ', event.candidate);
        calleeCandidatesCollection.add(event.candidate.toJSON());
      });
      // Code for collecting ICE candidates above

      peerConnection.addEventListener('track', event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          console.log('Add a track to the remoteStream:', track);
          remoteStream?.addTrack(track);
        });
      });

      // Code for creating SDP answer below
      const offer = roomSnapshot.data()?.offer;
      console.log('Got offer:', offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      console.log('Created answer:', answer);
      await peerConnection.setLocalDescription(answer);

      const roomWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      await roomRef.update(roomWithAnswer);
      // Code for creating SDP answer above

      // Listening for remote ICE candidates below
      roomRef.collection('callerCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
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
