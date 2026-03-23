import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import SetPassword from "./pages/SetPassword/SetPassword";

const App = () => {
  return (
    <>
    
    <ToastContainer
            position="top-center"
            autoClose={1500}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />

    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/set-password/:token" element={<SetPassword />} />


      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/dashboard"
        element={
          <ProtectedRoute role="member">
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
    </>
  );
};

export default App;
