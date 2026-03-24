import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fetchInfo } from "../../service/user/UserApi";

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchInviteDetails = async () => {
      try {
        const response = await fetchInfo(token)
        setUserInfo(response.data);
      } catch (err) {
        setError("Invalid or expired link");
      }
    };
  
    fetchInviteDetails();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("/api/auth/set-password", {
        token,
        password,
      });

      if (res.data.success) {
        alert("Password set successfully!");
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
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
        {userInfo && (
          <div className="mb-6 text-center">
            <p className="text-gray-300 text-sm">Invited as</p>
            <p className="text-white font-semibold">{userInfo.name}</p>
            <p className="text-gray-400 text-sm">{userInfo.email}</p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Set Your Password
        </h2>
        <p className="text-gray-200 text-center mb-6 text-sm">
          Create a secure password to continue
        </p>

        {error && (
          <p className="text-red-300 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 cursor-pointer text-gray-300 text-sm"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm Password */}
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