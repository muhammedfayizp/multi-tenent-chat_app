import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import store from "../redux/store"; 


const ProtectedRoute = ({ children, role }) => {

    let token =
        store.getState().auth.accessToken ||
        localStorage.getItem("accessToken");

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    if (!isLoggedIn) return <Navigate to="/" replace />;

    try {
        const decoded = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            return <Navigate to="/" replace />;
        }

    } catch {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
