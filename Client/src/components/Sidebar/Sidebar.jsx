import { useState } from "react";
import { FaComments, FaUser } from "react-icons/fa";
import { FilePen, Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  groups = [],
  setGroups,
  setShowGroupModal,
  activeChat,
  setActiveChat,
  showSidebar,
  setShowSidebar,
  showMenu,
  setShowMenu,
  menuRef,
  buttonRef,
}) => {
    console.log(groups);
    
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { email, isLoggedIn, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={`${showSidebar ? "block" : "hidden"} md:block w-full md:w-1/3 lg:w-1/4 border-r shadow-sm`}>

      {/* Header */}
      <div className="flex items-center justify-between p-4 text-xl text-white font-bold">
        <div className="flex items-center gap-2">
          <FaComments /> Groups
        </div>

        <div className="relative flex gap-3">
          {isLoggedIn && (
            <div className="relative">
              <div
                onClick={() => setShowProfileMenu(prev => !prev)}
                className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer"
              >
                <span className="text-sm font-semibold text-white">{email?.charAt(0).toUpperCase()}</span>
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {role?.toLowerCase() === "admin" && (
            <>
              <button
                ref={buttonRef}
                onClick={() => setShowMenu(prev => !prev)}
                className="p-2 rounded-full hover:bg-gray-700 transition"
              >
                <FilePen size={20} />
              </button>

              {showMenu && (
                <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-2xl z-10 border border-gray-700">
                  <button
                    onClick={() => {
                      setShowGroupModal(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 transition"
                  >
                    <Users size={16} className="text-blue-500" /> Create New Group
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Groups List */}
      {groups.length > 0 ? (
        groups.map(group => {
            console.log("Rendering group:", group.name);

            return (
                
          <div
            key={group._id}
            // onClick={() => setActiveChat(group)}
            onClick={() => {
              setActiveChat(group);
              setShowSidebar(false); 
            }}
            className={`flex items-center gap-3 p-4 border-b cursor-pointer hover:bg-gray-800 transition ${activeChat?._id === group._id ? "bg-gray-700" : ""}`}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 text-white">
              <FaUser size={18} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">{group.name}</div>
              <div className="text-sm text-gray-400 truncate">{group.lastMessage || "No messages yet"}</div>
            </div>
          </div>)
})
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
          {role === "admin" ? (
            <>
              <p className="text-center">You don't have any existing groups</p>
              <div
                className="flex items-center gap-2 text-blue-400 cursor-pointer hover:text-blue-300"
                onClick={() => setShowGroupModal(true)}
              >
                <FilePen size={20} />
                <span>Create a new group</span>
              </div>
            </>
          ) : (
            <p className="text-center">No groups yet. You will see groups when admin adds you.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
