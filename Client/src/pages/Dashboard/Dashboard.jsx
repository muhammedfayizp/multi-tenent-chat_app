import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import CreateGroupModal from "../../components/CreateGroupModal";
import DashboardImg from "./../../assets/DashboardImg.webp";
import { getGroups as getAdminGroups } from "../../service/admin/AdminApi";
import { getGroups as getmemberGroups } from "../../service/user/UserApi";
import { useSelector } from "react-redux";
import { connectSocket } from "../../socket/socket";

const Dashboard = () => {
  const [activeChat, setActiveChat] = useState(() => {
    const savedChat = localStorage.getItem("activeChat");
    return savedChat ? JSON.parse(savedChat) : null;
  });

  const [showSidebar, setShowSidebar] = useState(true);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [showMenu, setShowMenu] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [socket, setSocket] = useState(null);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) return;

    const newSocket = connectSocket(token);
    setSocket(newSocket);

    return () => {
      newSocket?.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!role) return;

    const fetchGroups = async () => {
      try {
        let response;

        if (role === "admin") {
          response = await getAdminGroups();
        } else if (role === "member") {
          response = await getmemberGroups();
        }

        if (response?.success) {
          setGroups(response.groups || []);
        }
      } catch (err) {
        console.error("Failed to fetch groups:", err);
      }
    };

    fetchGroups();
  }, [role]);

  console.log("sock", socket);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        menuRef={menuRef}
        buttonRef={buttonRef}
        setShowGroupModal={setShowGroupModal}
        groups={groups}
        setGroups={setGroups}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full"></div>

        {/* Modal */}
        {showGroupModal && (
          <CreateGroupModal
            setShowGroupModal={setShowGroupModal}
            setGroups={setGroups}
          />
        )}

        {/* Welcome Screen */}
        {!activeChat && isDesktop && (
          <div className="flex-1 flex items-center justify-center relative z-10">
            <div className="flex flex-col items-center text-center px-6">
              <img
                src={DashboardImg}
                alt="Dashboard"
                className="w-64 md:w-80 lg:w-96 drop-shadow-2xl hover:scale-105 transition"
              />

              <p className="text-gray-300 max-w-md mt-4">
                Join your groups, share moments, and keep conversations flowing effortlessly.
              </p>
            </div>
          </div>
        )}

        {/* Chat Window */}
        {activeChat && socket && (
          <ChatWindow
            socket={socket}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            setShowSidebar={setShowSidebar}
            isDesktop={isDesktop}
            setGroups={setGroups}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
