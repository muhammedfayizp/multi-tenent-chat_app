import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

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
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl w-full max-w-sm space-y-4"
      >
        <h2 className="text-white text-lg font-semibold">
          Set Your Password
        </h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded bg-gray-700 text-white outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 py-2 rounded text-white"
          disabled={loading}
        >
          {loading ? "Saving..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default SetPassword;