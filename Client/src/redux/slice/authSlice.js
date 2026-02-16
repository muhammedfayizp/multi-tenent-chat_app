import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getInitialState = () => {
    const token = localStorage.getItem("accessToken") || "";
    console.log(token,'inslice');
    
    if (!token) {
    return { isLoggedIn: false, token: "", role: "", email: "" };
  }

  try {
    const decoded = jwtDecode(token);
    const isValid = decoded.exp * 1000 > Date.now(); 

    return {
      isLoggedIn: isValid,
      token: isValid ? token : "",
      role: isValid ? localStorage.getItem("role") || "" : "",
      email: isValid ? localStorage.getItem("email") || "" : "",
    };
  } catch {
    return { isLoggedIn: false, token: "", role: "", email: "" };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role, email } = action.payload;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", email);

      state.isLoggedIn = true;
      state.token = token;
      state.role = role;
      state.email = email;
    },

    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      localStorage.removeItem("email");

      state.isLoggedIn = false;
      state.token = "";
      state.role = "";
      state.email = "";
    },

    refreshToken: (state, action) => {
      const { token } = action.payload;
      localStorage.setItem("accessToken", token);
      state.token = token;
      state.isLoggedIn = true;
    },
  },
});

export const { loginSuccess, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;

