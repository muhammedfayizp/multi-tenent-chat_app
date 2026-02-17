// import axios from "axios";
// import store from '../../redux/store';
// import { loginSuccess, logout } from '../../redux/slice/authSlice';

// const API_URL = import.meta.env.VITE_API_BASE_URL;

// //Public API client (login)
// export const PubApiClient = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// //Authenticated API client (protected routes)
// export const AxiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });





// AxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = store.getState().auth.token ||
//       localStorage.getItem("accessToken");

//     console.log("Interceptor Token 👉", token);

//     if (!config.headers) config.headers = {};

//     if (token && token !== "undefined") {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     console.log("Final Headers 👉", config.headers);

//     return config;
//   }
// );



// AxiosInstance.interceptors.response.use(
//   res => res,

//   async (err) => {
//     const originalReq = err.config;

//     if (err.response?.status === 401 && !originalReq._retry) {
//       originalReq._retry = true;

//       try {
//         const role = store.getState().auth.role;

//         const response = await axios.post(
//           `${API_URL}/${role}/auth/refresh_token`,
//           {},
//           { withCredentials: true }
//         );

//         const newToken = response.data.token;

//         store.dispatch(
//           loginSuccess({
//             token: newToken,
//             role: response.data.role,
//             email: store.getState().auth.email
//           })
//         );

//         localStorage.setItem("accessToken", newToken);

//         if (!originalReq.headers) originalReq.headers = {};
//         originalReq.headers.Authorization = `Bearer ${newToken}`;

//         return AxiosInstance(originalReq);

//       } catch (error) {
//         store.dispatch(logout());
//         localStorage.removeItem("accessToken");
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(err);
//   }
// );




// axiosInstance.js
import axios from "axios";
import store from '../../redux/store';
import { loginSuccess, logout } from '../../redux/slice/authSlice';

const API_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_URL,'axi');


export const PubApiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token || localStorage.getItem("accessToken");
  if (!config.headers) config.headers = {};
  if (token && token !== "undefined") config.headers.Authorization = `Bearer ${token}`;
  return config;
});

AxiosInstance.interceptors.response.use(
  res => res,
  async (err) => {
    const originalReq = err.config;
    if (err.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;
      try {
        const role = store.getState().auth.role?.trim(); // <- ensure correct role
        const response = await axios.post(`${API_URL}/${role}/auth/refresh_token`, {}, { withCredentials: true });
        const newToken = response.data.token;

        store.dispatch(loginSuccess({
          token: newToken,
          role: response.data.role,
          email: store.getState().auth.email
        }));

        localStorage.setItem("accessToken", newToken);
        if (!originalReq.headers) originalReq.headers = {};
        originalReq.headers.Authorization = `Bearer ${newToken}`;
        return AxiosInstance(originalReq);
      } catch (error) {
        store.dispatch(logout());
        localStorage.removeItem("accessToken");
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);
