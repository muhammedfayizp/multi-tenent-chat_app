import { useState } from "react";
import { X, Users, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { CreateGroup, getGroups } from "../service/admin/AdminApi";
import { CreateGroupValidate } from "../validation/CreateGroupValidation";

const CreateGroupModal = ({ setShowGroupModal, setGroups }) => {
    const [formData, setFormData] = useState({ name: "", users: [] });
    const [showUsers, setShowUsers] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    };

    const handleUserChange = (index, field, value) => {
        const updatedUsers = [...formData.users];
        updatedUsers[index][field] = value;
        setFormData(prev => ({ ...prev, users: updatedUsers }));
        if (errors.users?.[index]?.[field]) {
            const updatedErrors = { ...errors };
            updatedErrors.users[index][field] = "";
            setErrors(updatedErrors);
        }
    };

    const toggleUsers = () => {
        setShowUsers(prev => {
            const newValue = !prev;
            if (newValue && formData.users.length === 0) {
                setFormData(prev => ({ ...prev, users: [{ name: "", email: "", role: "member" }] }));
                setErrors(prev => ({ ...prev, users: [{}] }));
            }
            if (!newValue) setFormData(prev => ({ ...prev, users: [] }));
            return newValue;
        });
    };

    const addUserField = () => {
        setFormData(prev => ({ ...prev, users: [...prev.users, { name: "", email: "", role: "member" }] }));
        setErrors(prev => ({ ...prev, users: [...(prev.users || []), {}] }));
    };

    const removeUserField = (index) => {
        const updatedUsers = formData.users.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, users: updatedUsers }));
        setErrors(prev => ({ ...prev, users: prev.users?.filter((_, i) => i !== index) || [] }));
        if (updatedUsers.length === 0) setShowUsers(false);
    };

    const handleCreateGroup = async () => {
        const validationErrors = CreateGroupValidate({ groupName: formData.name, users: formData.users, showUsers });
        const hasErrors = Object.keys(validationErrors).length > 0 &&
            (validationErrors.groupName || (validationErrors.users && validationErrors.users.some(u => Object.keys(u).length > 0)));
        if (hasErrors) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await CreateGroup(formData);
            if (response.success) {
                toast.success(response.message);

                const updatedGroups = await getGroups();

                if (updatedGroups?.success && setGroups) {
                    setGroups(updatedGroups.groups || []);
                }

                setShowGroupModal(false);
                setFormData({ name: "", users: [] });
                setShowUsers(false);
                setErrors({});
            } else {
                toast.error(response.message || "Failed to create group");
            }
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-md p-6 rounded-3xl shadow-2xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                <button onClick={() => setShowGroupModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition"><X size={22} /></button>
                <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-xl bg-blue-500/20"><Users className="text-blue-400" /></div>
                    <h2 className="text-lg font-semibold text-white">Create New Group</h2>
                </div>

                <input
                    type="text"
                    placeholder="Enter group name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`w-full p-3 rounded-xl bg-white/5 border ${errors.groupName ? 'border-red-400' : 'border-white/10'} text-white placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition mb-3`}
                />
                {errors.groupName && <p className="text-red-400 text-sm mb-2">{errors.groupName}</p>}

                <button type="button" onClick={toggleUsers} className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300 transition mb-3">
                    <Plus size={16} /> {showUsers ? "Hide Users" : "Add Users (Optional)"}
                </button>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateGroup(); }}>
                    {showUsers && formData.users.map((user, index) => (
                        <div key={index} className="flex gap-2 items-center bg-white/5 p-2 rounded-xl border border-white/10 flex-wrap sm:flex-nowrap">
                            <input type="text" placeholder="Name" value={user.name} onChange={(e) => handleUserChange(index, "name", e.target.value)} className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition" />
                            <input type="email" placeholder="Email" value={user.email} onChange={(e) => handleUserChange(index, "email", e.target.value)} className="flex-1 p-2 rounded-lg bg-transparent text-white outline-none" />
                            <select value={user.role} onChange={(e) => handleUserChange(index, "role", e.target.value)} className="p-2 rounded-lg bg-black/30 text-white border border-white/10">
                                <option value="" disabled>Select Role</option>
                                <option value="member">Member</option>
                            </select>
                            <button type="button" onClick={() => removeUserField(index)} className="text-red-400 hover:text-red-300 text-sm ml-auto sm:ml-0">Remove</button>
                        </div>
                    ))}
                    {showUsers && <button type="button" onClick={addUserField} className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition mt-2">Add Another User</button>}

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setShowGroupModal(false)} className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">Cancel</button>
                        <button type="submit" disabled={loading} className={`px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
