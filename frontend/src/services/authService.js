import api from "@/lib/axios";

export const authService = {
  signUp: async (username, password, email, firstName, lastName) => {
    const res = await api.post(
      "/auth/signup",
      { username, password, email, firstName, lastName },
      { withCredentials: true }
    );

    return res.data;
  },

  signIn: async (username, password) => {
    const res = await api.post(
      "/auth/signin",
      { username, password },
      { withCredentials: true }
    );

    return res.data; // access token
  },

  signOut: async () => {
    return api.post("/auth/signout", null, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", null, {
      withCredentials: true,
    });
    return res.data.accessToken;
  },
};
