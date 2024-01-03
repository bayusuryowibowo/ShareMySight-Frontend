"use client";
import React, {
  createContext,
  useState,
  useRef,
  ReactNode,
  MutableRefObject,
} from "react";
import { Socket, io } from "socket.io-client";
import Peer from "simple-peer";

type Call = {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: Peer.SignalData;
};

type SocketContextType = {
  call: Call;
  callAccepted: boolean;
  myVideo: MutableRefObject<HTMLVideoElement | undefined> | undefined;
  userVideo: MutableRefObject<HTMLVideoElement | undefined> | undefined;
  stream: MediaStream | undefined;
  name: string;
  setName: (value: React.SetStateAction<string>) => void;
  callEnded: boolean;
  me: string;
  // callUser: (id: string) => void;
  leaveCall: () => void;
  // answerCall: () => void;
  // callRandomUser: () => void;
  // socket: Socket;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  setCall: React.Dispatch<React.SetStateAction<Call>>;
  setMe: React.Dispatch<React.SetStateAction<string>>;
};

export const SocketContext = createContext<SocketContextType | any>(undefined);

type SocketProviderProps = {
  children: ReactNode;
};

// const socket = io("ws://localhost:8081");

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
}) => {
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

  // const answerCall = () => {
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
  // };

  // const callUser = (id: string) => {
  //   const peer = new Peer({ initiator: true, trickle: false, stream });

  //   peer.on("signal", (data) => {
  //     socket.emit("callUser", {
  //       userToCall: id,
  //       signalData: data,
  //       from: me,
  //       name,
  //     });
  //   });

  //   peer.on("stream", (currentStream) => {
  //     if (userVideo.current) {
  //       userVideo.current.srcObject = currentStream;
  //     }
  //   });

  //   socket.on("callAccepted", (signal) => {
  //     setCallAccepted(true);

  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // };

  // const callRandomUser = () => {
  //   const peer = new Peer({ initiator: true, trickle: false, stream });

  //   peer.on("signal", (data) => {
  //     socket.emit("startRandomCall", {
  //       signalData: data,
  //       from: me,
  //       name,
  //     });
  //   });

  //   peer.on("stream", (currentStream) => {
  //     if (userVideo.current) {
  //       userVideo.current.srcObject = currentStream;
  //     }
  //   });

  //   socket.on("callAccepted", (signal) => {
  //     setCallAccepted(true);

  //     peer.signal(signal);
  //   });

  //   connectionRef.current = peer;
  // }

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current?.destroy();

    window.location.reload();
  };

  const contextValue: SocketContextType = {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    // callUser,
    leaveCall,
    // answerCall,
    // callRandomUser,
    // socket,
    setStream,
    setCall,
    setMe
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
