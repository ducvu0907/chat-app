import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { SocketContext } from "../contexts/SocketContext";
import { FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";

export default function VideoCallContainer() {
  const [conversation, setConversation] = useState(null);
  const { authUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [rtcCon, setRtcCon] = useState<RTCPeerConnection | null>(null);
  const [otherUserIds, setOtherUserIds] = useState<string[]>([]);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    const storedConversation = sessionStorage.getItem('selectedConversation');
    if (storedConversation) {
      setConversation(JSON.parse(storedConversation));
      sessionStorage.removeItem('selectedConversation');
    }
  }, []);

  useEffect(() => {
    if (conversation && authUser) {
      setOtherUserIds(conversation.participants.filter(p => p._id !== authUser._id).map(p => p._id));
    }
  }, [conversation, authUser]);

  useEffect(() => {
    if (!rtcCon && otherUserIds.length > 0) {
      const servers = {
        iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }],
        iceCandidatePoolSize: 10,
      };

      const connection = new RTCPeerConnection(servers);

      connection.ontrack = (event) => {
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          otherUserIds.forEach(userId => socket?.emit("ice-candidate", { candidate: event.candidate, to: userId }));
        }
      };

      setRtcCon(connection);
    }
  }, [otherUserIds, socket]);

  useEffect(() => {
    if (!rtcCon || !socket) return;

    const handleReceiveOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit, from: string }) => {
      try {
        await rtcCon.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await rtcCon.createAnswer();
        await rtcCon.setLocalDescription(answer);
        socket.emit("answer", { answer, to: from });
        setIsCallStarted(true);
      } catch (error) {
        console.error("Error handling offer", error);
      }
    };

    const handleReceiveAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      try {
        await rtcCon.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error("Error handling answer", error);
      }
    };

    const handleReceiveIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try {
        if (candidate) {
          await rtcCon.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error("Error handling ICE candidate", error);
      }
    };

    socket.on("receive-offer", handleReceiveOffer);
    socket.on("receive-answer", handleReceiveAnswer);
    socket.on("receive-ice-candidate", handleReceiveIceCandidate);

    return () => {
      socket.off("receive-offer", handleReceiveOffer);
      socket.off("receive-answer", handleReceiveAnswer);
      socket.off("receive-ice-candidate", handleReceiveIceCandidate);
    };
  }, [rtcCon, socket]);

  const startCall = async () => {
    try {
      if (!rtcCon) return;

      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStream.getTracks().forEach(track => rtcCon.addTrack(track, localStream));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const offer = await rtcCon.createOffer();
      await rtcCon.setLocalDescription(offer);

      otherUserIds.forEach(userId => socket?.emit("offer", { offer, to: userId }));
      setIsCallStarted(true);
    } catch (error) {
      console.error("Error while starting call", error);
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream).getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream).getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-[#36393f] text-white">
      <header className="bg-[#202225] p-4 flex justify-between items-center">
        {!isCallStarted ? (
          <button
            onClick={startCall}
            className="bg-[#3ba55d] text-white py-2 px-4 rounded hover:bg-[#2d7d46] transition duration-200"
          >
            Join Call
          </button>
        ) : (
          <button
            onClick={() => window.close()}
            className="bg-[#ed4245] text-white py-2 px-4 rounded hover:bg-[#c03537] transition duration-200"
          >
            Leave Call
          </button>
        )}
      </header>
      <div className="flex-grow p-4 flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-4xl">
          <div className="aspect-video bg-[#2f3136] rounded-lg overflow-hidden relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              Remote User
            </div>
          </div>
          <div className="aspect-video bg-[#2f3136] rounded-lg overflow-hidden relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              You
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-[#292b2f] p-4 flex justify-center space-x-4">
        <button
          onClick={toggleMute}
          className={`rounded-full p-3 transition duration-200 ${isMuted ? 'bg-[#ed4245]' : 'bg-[#4f545c] hover:bg-[#686d73]'}`}
        >
          {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`rounded-full p-3 transition duration-200 ${isVideoOff ? 'bg-[#ed4245]' : 'bg-[#4f545c] hover:bg-[#686d73]'}`}
        >
          {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
        </button>
      </footer>
    </div>
  );
}