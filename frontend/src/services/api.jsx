import axios from "axios";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "{}");
  } catch {
    return {};
  }
};

// Earlier copies of this project used different token key names.  Recover
// those sessions once and migrate them to the current names used by all APIs.
const getAccessToken = () => {
  const token = localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    getStoredUser().token;
  if (token) localStorage.setItem("token", token);
  return token;
};

const getRefreshToken = () => {
  const token = localStorage.getItem("refresh_token") ||
    localStorage.getItem("refreshToken") ||
    getStoredUser().refresh_token ||
    getStoredUser().refreshToken;
  if (token) localStorage.setItem("refresh_token", token);
  return token;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api"
});


api.interceptors.request.use(
  (config) => {

    const token = getAccessToken();

    if(token){
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
);

// Keep authenticated API pages working when an access token expires while the
// browser is open.  Retry only once to prevent refresh loops.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest?._retried) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.reject(error);

    originalRequest._retried = true;
    try {
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refresh_token: refreshToken }
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);


export default api;
