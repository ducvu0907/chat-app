import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { SocketContext } from "../contexts/SocketContext";

// TODO: handle in call context (currently can join multiple calls)
export default function VideoCallContainer() {
  const [conversation, setConversation] = useState(null);
  const { authUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const [rtcConns, setRtcConns] = useState<Map<string, RTCPeerConnection>>(new Map()); // map id to peer connection
  const [streams, setStreams] = useState<Map<string, MediaStream>>(new Map()); // map id to stream source
  const [otherUserIds, setOtherUserIds] = useState<string[]>([]);
  const [otherUserNames, setOtherUserNames] = useState<Map<string, string>>(new Map()); // map id to name

  // parse conversation from session storage (kinda scuffed, might change later) 
  useEffect(() => {
    const storedConversation = sessionStorage.getItem('selectedConversation');
    if (storedConversation) {
      setConversation(JSON.parse(storedConversation));
      sessionStorage.removeItem('selectedConversation');
    }
  }, []);

  // get other participants
  useEffect(() => {
    if (conversation && authUser) {
      const ids = conversation.participants.filter(p => p._id !== authUser._id).map(p => p._id);
      const userNames = new Map<string, string>();

      conversation.participants.forEach(p => {
        userNames.set(p._id, p.name);
      });

      setOtherUserIds(ids);
      setOtherUserNames(userNames);
    }
  }, [conversation, authUser]);

  // set up connections and event listener
  useEffect(() => {
    if (otherUserIds.length > 0) {
      const newRtcConns = new Map<string, RTCPeerConnection>();

      otherUserIds.forEach(userId => {
        const servers = {
          iceServers: [{ urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] }],
          iceCandidatePoolSize: 10,
        };
        const connection = new RTCPeerConnection(servers);

        // pull remote stream and feed to the element
        connection.ontrack = (event) => {
          setStreams(prevStreams => {
            const updatedStreams = new Map(prevStreams);
            if (event.streams[0]) {
              updatedStreams.set(userId, event.streams[0]);
            }
            return updatedStreams;
          });
        };

        // send ice candidate
        connection.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.emit("ice-candidate", { candidate: event.candidate, to: userId, convId: conversation?._id });
          }
        };

        newRtcConns.set(userId, connection);
      });
      setRtcConns(newRtcConns);
    }
  }, [otherUserIds, socket]);

  // add socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveOffer = async ({ offer, from, convId }: { offer: RTCSessionDescriptionInit, from: string, convId: string }) => {
      // if not the same conversation
      if (convId !== conversation?._id) {
        return;
      }
      const connection = rtcConns.get(from);
      if (connection) {
        try {
          await connection.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await connection.createAnswer();
          await connection.setLocalDescription(answer);
          socket.emit("answer", { answer, to: from, convId: conversation?._id });
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handleReceiveAnswer = async ({ answer, from, convId }: { answer: RTCSessionDescriptionInit, from: string, convId: string }) => {
      if (convId !== conversation?._id) {
        return;
      }
      const connection = rtcConns.get(from);
      if (connection) {
        try {
          await connection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
          console.log(error);
        }
      }
    };

    const handleReceiveIceCandidate = async ({ candidate, from, convId }: { candidate: RTCIceCandidateInit, from: string, convId: string }) => {
      if (convId !== conversation?._id) {
        return;
      }
      const connection = rtcConns.get(from);
      if (connection && candidate) {
        try {
          await connection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error(error);
        }
      }
    };

    const handleLeave = ({ from, convId }: { from: string, convId: string }) => {
      if (convId !== conversation?._id) {
        return;
      }
      setStreams(prevStreams => {
        const updatedStreams = new Map(prevStreams);
        updatedStreams.delete(from);
        return updatedStreams;
      });
    };

    socket.on("receive-offer", handleReceiveOffer);
    socket.on("receive-answer", handleReceiveAnswer);
    socket.on("receive-ice-candidate", handleReceiveIceCandidate);
    socket.on("leave", handleLeave);

    return () => {
      socket.off("receive-offer", handleReceiveOffer);
      socket.off("receive-answer", handleReceiveAnswer);
      socket.off("receive-ice-candidate", handleReceiveIceCandidate);
      socket.off("receive-leave", handleLeave);
    };
  }, [rtcConns, socket]);

  // join call
  useEffect(() => {
    const joinCall = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localStream.getTracks().forEach(track => {
          rtcConns.forEach(connection => {
            connection.addTrack(track, localStream);
          });
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        // for (const [userId, connection] of rtcConns.entries()) {
        //   const offer = await connection.createOffer();
        //   await connection.setLocalDescription(offer);
        //   socket?.emit("offer", { offer, to: userId });
        // }

        await Promise.all(Array.from(rtcConns.entries()).map(async ([userId, connection]) => {
          const offer = await connection.createOffer();
          await connection.setLocalDescription(offer);
          socket?.emit("offer", { offer, to: userId, convId: conversation?._id });
        }));

      } catch (error) {
        console.error(error);
      }
    };

    joinCall();

    // should cleanup but already close the window anyway

  }, [rtcConns, socket]);

  const leaveCall = () => {
    if (localVideoRef.current) {
      const localStream = localVideoRef.current.srcObject as MediaStream;
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    }
    rtcConns.forEach(connection => connection.close());

    setRtcConns(new Map());
    setStreams(new Map());

    otherUserIds.forEach(userId => {
      socket?.emit("leave", { to: userId, convId: conversation?._id });
    });

    window.close();
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#36393f] text-white">
      <div className="bg-[#202225] p-4 flex justify-between items-center border-b border-[#2f3136]">
        <button
          onClick={leaveCall}
          className="bg-red-600 text-white py-2 px-4 rounded hover:bg-[#c03537] transition duration-200"
        >
          Leave call
        </button>
      </div>
      <div className="flex-grow p-4 flex justify-center items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {[...streams.entries()].map(([userId, stream], index) => (
            <div key={index} className="relative bg-[#2f3136] rounded-lg overflow-hidden shadow-lg">
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={el => { if (el) el.srcObject = stream; }}
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-3 py-1 rounded text-sm shadow-md">
                {otherUserNames.get(userId)}
              </div>
            </div>
          ))}
          <div className="relative bg-[#2f3136] rounded-lg overflow-hidden shadow-lg border-2 border-blue-500">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 px-3 py-1 rounded text-sm shadow-md">
              you
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
