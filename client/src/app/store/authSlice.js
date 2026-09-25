// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  if (typeof window === "undefined") {
    return { user: null, accessToken: null, refreshToken: null, role: null };
  }
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return {
    user,
    role: user?.role || localStorage.getItem("role") || null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.role = user?.role || "customer";
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", state.role);
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

      if (accessToken) {
        document.cookie = `accessToken=${accessToken}; path=/; max-age=604800; SameSite=Lax`;
      }
    },
    updateTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    logOut: (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    },
  },
});

export const { setCredentials, updateTokens, logOut } = authSlice.actions;
export default authSlice.reducer;
