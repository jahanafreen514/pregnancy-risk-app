import axios from "axios";

const API = "http://127.0.0.1:8000/api/auth";


// ===============================
// LOGIN
// ===============================

export const loginUser = async (data) => {
  return await axios.post(
    `${API}/login`,
    data
  );
};


// ===============================
// REGISTER
// ===============================

export const registerUser = async (data) => {
  return await axios.post(
    `${API}/register`,
    data
  );
};


// ===============================
// REFRESH TOKEN
// ===============================

export const refreshAccessToken = async () => {

  const refreshToken = localStorage.getItem(
    "refresh_token"
  );


  if (!refreshToken) {
    return null;
  }
  try {

    const response = await axios.post(`${API}/refresh`, {
      refresh_token: refreshToken,
    });


    const newToken =
      response.data.access_token;

  

    

    localStorage.setItem(
      "token",
      newToken
    );


    return newToken;


  } catch (error) {

    console.error(
      "Refresh token failed:",
      error
    );


    logout();

    return null;
  }
};



// ===============================
// LOGOUT
// ===============================

export const logout = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "refresh_token"
  );

  localStorage.removeItem(
    "currentUser"
  );
};



// ===============================
// SAVE TOKENS
// ===============================

export const saveToken = (
  accessToken,
  refreshToken
) => {

  localStorage.setItem(
    "token",
    accessToken
  );


  localStorage.setItem(
    "refresh_token",
    refreshToken
  );
};



// ===============================
// GET ACCESS TOKEN
// ===============================

export const getToken = () => {

  return localStorage.getItem(
    "token"
  );
};



// ===============================
// AUTH HEADER
// ===============================

export const authHeader = () => {

  const token = getToken();


  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};
