import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/set-password", {
        token,
        password,
      });

      if (res.data.success) {
        alert("Password set successfully!");
        navigate("/login");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">

  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8"
  >

    {/* Header */}
    <h2 className="text-3xl font-bold text-white text-center mb-2">
      Set Your Password
    </h2>
    <p className="text-gray-200 text-center mb-6 text-sm">
      Create a secure password to continue
    </p>

    {/* Password Field */}
    <div className="relative mb-4">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

      {/* Show/Hide Icon */}
      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-5 cursor-pointer text-gray-300 text-sm"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* Confirm Password (Optional but recommended) */}
    <div className="relative mb-6">
      <input
        type={showConfirm ? "text" : "password"}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      />

      <span
        onClick={() => setShowConfirm(!showConfirm)}
        className="absolute right-3 top-5 cursor-pointer text-gray-300 text-sm"
      >
        {showConfirm ? <FaEyeSlash /> : <FaEye />}
      </span>
    </div>

    {/* Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-500 text-white p-3 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300 disabled:bg-indigo-300 shadow-lg"
    >
      {loading ? "Saving..." : "Set Password"}
    </button>

  </form>
</div>
  );
};

export default SetPassword;