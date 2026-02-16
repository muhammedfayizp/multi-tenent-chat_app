import React, { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { Send, ArrowLeft } from "lucide-react";
import GroupInfo from "../GroupInfo";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getMessages } from "../../service/chat/ChatApi";

const ChatWindow = ({
    socket,
    activeChat,
    setActiveChat,
    setShowSidebar,
    isDesktop,
    setGroups,
}) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [showGroupInfo, setShowGroupInfo] = useState(false);

    const auth = useSelector((state) => state.auth);
    const decoded = jwtDecode(auth.token);
    const userId = decoded.userId;

    const messagesEndRef = useRef(null);

    const otherMembersCount = activeChat?.members?.filter(m => m !== userId).length || 1;


    useEffect(() => {
        const savedChat = localStorage.getItem("activeChat");
        if (savedChat) {
            setActiveChat(JSON.parse(savedChat));
        }
    }, [setActiveChat]);


    useEffect(() => {
        if (activeChat) {
            localStorage.setItem("activeChat", JSON.stringify(activeChat));
        } else {
            localStorage.removeItem("activeChat");
        }
    }, [activeChat]);



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        if (!socket || !activeChat?._id) return;
        socket.emit("joinGroup", { groupId: activeChat._id });
    }, [socket, activeChat?._id]);


    useEffect(() => {
        if (!socket || !activeChat?._id) return;

        const handleReceive = (msg) => {
            if (msg.groupId === activeChat._id) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receiveMessage", handleReceive);

        return () => {
            socket.off("receiveMessage", handleReceive);
        };
    }, [socket, activeChat?._id]);

    useEffect(() => {
        if (!activeChat?._id || !messages.length) return;

        const unread = messages
            .filter(msg => msg.senderId !== userId && msg.read !== "read")
            .map(msg => msg._id);

        if (unread.length > 0) {
            socket.emit("messageRead", { groupId: activeChat._id, messageIds: unread, userId });

            setMessages(prev =>
                prev.map(msg =>
                    unread.includes(msg._id) ? { ...msg, read: "read" } : msg
                )
            );
        }
    }, [activeChat?._id, messages]);


    useEffect(() => {
        if (!socket) return;

        const handleReadUpdate = ({ messageId }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId ? { ...msg, read: "read" } : msg
                )
            );
        };

        socket.on("messageReadUpdate", handleReadUpdate);

        return () => socket.off("messageReadUpdate", handleReadUpdate);
    }, [socket]);



    useEffect(() => {
        if (!activeChat?._id) return;

        const fetchMessages = async () => {
            try {
                const response = await getMessages(activeChat._id);
                if (response?.success) setMessages(response.messages || []);
            } catch (err) {
                console.error("Fetch messages failed", err);
            }
        };

        fetchMessages();
    }, [activeChat?._id]);

    const sendMessage = () => {
        if (!text.trim() || !activeChat?._id) return;

        const messageData = {
            groupId: activeChat._id,
            content: text,
            read: "sent"

        };

        socket.emit("sendMessage", messageData);

        setText("");
    };



    return (
        <div className="flex h-full relative">
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${showGroupInfo ? "md:w-2/3 lg:w-3/4" : "w-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 backdrop-blur-lg bg-white/5 border-b border-white/10 shadow-md">
                    {activeChat ? (
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => setShowGroupInfo(true)}
                        >
                            <div className="relative w-11 h-11">
                                {activeChat.profileImage ? (
                                    <img
                                        src={activeChat.profileImage}
                                        className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                                        alt="profile"
                                    />
                                ) : (
                                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-600 text-white">
                                        <FaUser />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-white font-semibold text-lg">
                                    {activeChat.name}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <span className="text-gray-400">
                            {isDesktop ? "Select a chat to start messaging" : ""}
                        </span>
                    )}

                    {activeChat && (
                        <button
                            onClick={() => {
                                setShowSidebar(true);
                                setActiveChat(null);
                                localStorage.removeItem("activeChat");
                            }}
                            className="text-blue-400 text-sm font-medium"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col space-y-2 relative">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === userId;
                        return (
                            <div
                                key={msg._id}
                                className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`relative max-w-[75%] flex flex-col justify-between px-4 py-2 rounded-xl text-sm shadow-md break-words ${isMe
                                        ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-none"
                                        : "bg-white/10 text-gray-200 border border-white/10 rounded-bl-none"
                                        }`}
                                >
                                    <div className="flex justify-start items-center">{msg.content}</div>
                                    <div className="flex justify-end items-center mt-1 text-[10px] opacity-70 gap-1">
                                        <span>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        {isMe && (
                                            <span className="text-xs">
                                                {msg.readBy?.length === 0 && "✓"} {/* sent */}
                                                {msg.readBy?.length > 0 && msg.readBy.length < activeChat.members.length - 1 && "✓✓"} {/* delivered */}
                                                {msg.readBy?.length === activeChat.members.filter(m => m !== userId).length && <span className="text-blue-400">✓✓</span>} {/* read by all */}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {activeChat && (
                    <div className="p-4 border-t flex items-center gap-2 relative">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-white/10 bg-white/5 backdrop-blur-lg rounded-lg px-4 py-2 text-white focus:outline-none"
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button
                            onClick={sendMessage}
                            className="p-3 text-white hover:bg-white/10 rounded-lg"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Group Info */}
            {activeChat && showGroupInfo && (
                <GroupInfo
                    group={activeChat}
                    onClose={() => setShowGroupInfo(false)}
                    setGroups={setGroups}
                    setActiveChat={setActiveChat}
                    setShowSidebar={setShowSidebar}
                />
            )}
        </div>
    );
};

export default ChatWindow;

