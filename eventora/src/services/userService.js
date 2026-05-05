import api from "./api";

export const getCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch("/auth/me", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.patch("/auth/me/password", payload);
  return data;
};
