import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "./../../assets/loginPimage.webp";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginFormValidate } from "../../validation/LoginValidation";
import { toast } from "react-toastify";
import { AdminLogin } from "../../service/admin/AdminApi";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/authSlice";
import { UserLogin } from "../../service/user/UserApi";




const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        orgName: ''
    })
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = LoginFormValidate(formData);

        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }

        setLoading(true);

        try {
            console.log(formData)


            if (formData.role === "admin") {

                const response = await AdminLogin(formData);

                if (response.success) {
                    dispatch(loginSuccess({
                        token: response.accessToken,
                        role: response.role,
                        email: response.email
                    }));
                    toast.success(response.message);
                    navigate("/admin/dashboard");
                } else {
                    toast.error(response.message);
                }

            } else {

                const response = await UserLogin(formData);

                if (response.success) {
                    dispatch(loginSuccess({
                        token: response.accessToken,
                        role: response.role,
                        email: response.email
                    }));
                    toast.success(response.message);
                    navigate("/member/dashboard");
                } else {
                    toast.error(response.message);
                }
            }

        } catch (err) {
            console.log(err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full min-h-screen  flex items-center justify-center px-4">

            <div className="flex flex-col lg:flex-row items-center gap-50 max-w-6xl w-full">

                {/* Image Section */}
                <div className="hidden lg:block">
                    <img
                        src={loginImage}
                        alt="login"
                        className="w-[420px] drop-shadow-2xl animate-fadeIn"
                    />
                </div>

                {/* Login Card */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8"
                >
                    {/* Header */}
                    <h2 className="text-3xl font-bold text-white text-center mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-200 text-center mb-6 text-sm">
                        Login to continue your group chat
                    </p>

                    {/* Name Field */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                        {error.name && (
                            <p className="text-red-300 text-sm mt-1">{error.name}</p>
                        )}
                    </div>

                    {formData.role === "admin" && (
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Organization Name"
                                value={formData.orgName}
                                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            />
                            {error.orgName && (
                                <p className="text-red-300 text-sm mt-1">{error.orgName}</p>
                            )}
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="relative mb-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                        {error.email && (
                            <p className="text-red-300 text-sm mt-1">{error.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="relative mb-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-3 bg-white/10 border border-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-5 cursor-pointer text-gray-300 text-sm"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                        {error.password && (
                            <p className="text-red-300 text-sm mt-1">{error.password}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="mb-6">
                            <p className="text-gray-300 mb-2 font-medium">Select Role:</p>
                            <div className="flex gap-4">
                                {["Admin", "Member"].map((r) => {
                                    const roleValue = r.toLowerCase();
                                    return (
                                        <label
                                            key={r}
                                            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border transition
                                                ${formData.role === roleValue
                                                    ? "bg-blue-500 border-blue-500 text-white shadow-md"
                                                    : "bg-transparent border-white/20 text-gray-200 hover:bg-white/10"}
                                                `}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={roleValue}
                                                checked={formData.role === roleValue}
                                                onChange={() =>
                                                    setFormData({ ...formData, role: roleValue })
                                                }
                                                className="accent-blue-500"
                                            />
                                            <span className="text-sm font-medium">{r}</span>
                                        </label>
                                    );
                                })}
                            </div>
                            {error.role && (
                                <p className="text-red-300 text-sm mt-1">{error.role}</p>
                            )}
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-indigo-500 text-white p-3 px-5 rounded-xl font-semibold hover:bg-indigo-600 transition duration-300 disabled:bg-indigo-300 shadow-lg"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                    <div>
                        <p className="text-gray-200 text-sm text-center sm:text-left">
                            Don't have an account?{" "}
                            <span className="text-white font-semibold cursor-pointer hover:underline">
                                Sign up
                            </span>
                        </p>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default Login;
