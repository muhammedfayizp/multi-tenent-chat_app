import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUser, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { addMemberToGroup, fetchMembers, getGroups, leaveOrDeleteGroup, removeMember, } from "../service/admin/AdminApi";

const GroupInfo = ({
    group,
    onClose,
    setGroups,
    setActiveChat,
    setShowSidebar
}) => {
    const [showAddInput, setShowAddInput] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("member");
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState([]);
    const [orgName, setOrgName] = useState("Unknown Org");

    // const [activeChat, setActiveChat] = useState(null);


    const { email: loggedEmail, role: loggedRole, userId } = useSelector((state) => state.auth);
    const isAdmin = loggedRole === "admin";


    useEffect(() => {
        if (!group) return;

        if (group.members && group.members.length > 0) {
            setMembers(group.members);
        }

        const fetchMember = async () => {
            try {
                setLoading(true);

                const response = await fetchMembers(group._id);
                console.log(response, 'fetch')

                if (response?.success) {
                    setMembers(response.members || []);
                    setOrgName(response.orgName || "Unknown Org");

                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMember();

    }, [group]);

    const handleAddMember = async () => {

        const email = newMemberEmail.trim();
        if (!email) return toast.error("Enter a valid email");

        setLoading(true);
        try {
            const response = await addMemberToGroup({ userName: newMemberName, email: newMemberEmail, role: newMemberRole, groupId: group._id, });

            if (response?.success) {
                setMembers(response.group.members || []);
                toast.success(response.message);
            }
            setNewMemberName("");
            setNewMemberEmail("");
            setShowAddInput(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add member");
        }
    };


    const handleLeaveOrDelete = async (groupId) => {

        if (!groupId) {
            toast.error("Invalid group");
            return;
        }

        const confirmAction = window.confirm(
            isAdmin
                ? "Are you sure you want to delete this community?"
                : "Are you sure you want to leave this community?"
        );

        if (!confirmAction) return;

        try {

            setLoading(true);

            const response = await leaveOrDeleteGroup(groupId);
            toast.success(response.message);

            setActiveChat(null);

            const updatedGroups = await getGroups();

            if (updatedGroups?.success) {
                setGroups(updatedGroups.groups || []);
            }

            onClose();
            setShowSidebar?.(true);

        } catch (error) {

            toast.error(error?.response?.data?.message || error?.message || "Action failed");

        }
    };



    const handleRemoveMember = async (groupId, memberId) => {
        try {

            const confirmRemove = window.confirm(
                "Are you sure you want to remove this member?"
            );

            if (!confirmRemove) return;
            const response = await removeMember(groupId, memberId);


            if (response.success) {

                setMembers((prevMembers) =>
                    prevMembers.filter((member) => member._id !== memberId)
                );
            }

        } catch (error) {
            console.error("Failed to remove member", error);
        }
    };


    return (
        <div className="fixed top-0 right-0 h-full z-50 w-full max-w-[400px] bg-black/40 backdrop-blur-md border-l border-gray-700 shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 px-4 py-5 bg-gradient-to-r from-[#1a1a1a]/80 to-[#2c2c2c]/80 shadow-sm">
                <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                    <FaTimes size={18} />
                </button>
                <h2 className="text-lg text-gray-300 font-semibold flex-1">Community Info</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex flex-col items-center border-b border-gray-800 pb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center mb-3 shadow-xl overflow-hidden">
                        {group.profileImage ? (
                            <img src={group.profileImage} alt="Group" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <FaUser className="text-4xl text-white" />
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-white text-center">{group.name}</h1>
                    <p className="text-sm text-[#8696a0] text-center">Organized by {orgName || "Unknown Org"}</p>
                </div>

                {/* AddMembers */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[#8696a0] font-semibold text-sm tracking-wide">Members</h3>
                        {isAdmin && (
                            <div className="flex items-center gap-2">
                                {!showAddInput && (
                                    <button onClick={() => setShowAddInput(true)} className="text-[#00a884] text-sm font-medium hover:text-[#00d69f] transition">
                                        + Add
                                    </button>
                                )}
                                <p className="text-gray-400">|</p>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/join/${group._id}`);
                                        toast.success("Invite link copied!");
                                    }}
                                    className="text-blue-400 text-sm font-medium hover:text-blue-500 transition"
                                >
                                    Invite
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Add Member Input */}
                    {showAddInput && (
                        <div className="flex gap-2 mb-2 flex-col md:flex-row">
                            <input
                                type="text"
                                placeholder="Enter name"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                className="flex-1 p-2 rounded-lg bg-[#1c1c1c]/80 text-white outline-none text-sm placeholder-gray-400 backdrop-blur-sm"
                            />

                            <input
                                type="email"
                                placeholder="Enter email"
                                value={newMemberEmail}
                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                className="flex-1 p-2 rounded-lg bg-[#1c1c1c]/80 text-white outline-none text-sm placeholder-gray-400 backdrop-blur-sm"
                            />

                            <select
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value)}
                                className="p-2 rounded-lg bg-[#1c1c1c]/80 text-white text-sm"
                            >
                                <option value="member">Member</option>
                            </select>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddMember}
                                    disabled={loading}
                                    className="bg-[#00a884] px-3 rounded-lg text-sm font-semibold hover:bg-[#00d69f] transition disabled:opacity-50"
                                >
                                    {loading ? "Adding..." : "Add"}
                                </button>
                                <button
                                    onClick={() => setShowAddInput(false)}
                                    className="text-xs text-gray-400 hover:text-gray-200 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Members List */}
                    <ul className="space-y-2">
                        {members.map((member, index) => (
                            <li key={member._id || member.email || index} className="flex flex-col md:flex-row items-center justify-between gap-2 px-3 py-2 bg-[#1c1c1c]/70 hover:bg-[#2a2a2a]/80 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                                        <FaUser className="text-white text-sm" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white">{member.name}</span>
                                        {member.role === "admin" && (
                                            <span className="text-xs text-[#00a884] font-medium px-2 py-0.5 rounded-lg bg-[#1a1a1a]/60">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {loggedRole === "admin" && member.role !== "admin" && member._id !== userId && (
                                    <button
                                        onClick={() => handleRemoveMember(group._id, member._id)}
                                        className="text-red-500 text-xs font-semibold hover:text-red-400 transition mt-2 md:mt-0"
                                    >
                                        Remove
                                    </button>
                                )}

                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6 border-t border-gray-800 pt-4">
                    <button
                        onClick={() => handleLeaveOrDelete(group._id)}
                        className="flex items-center gap-3 text-[#f15c6d] hover:bg-[#2a2a2a]/80 w-full p-3 rounded-xl font-medium transition"
                    >
                        <FaSignOutAlt />
                        <span>{isAdmin ? "Delete Community" : "Leave Community"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupInfo;
