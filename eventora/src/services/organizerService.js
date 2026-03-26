import api from "./api";

export const getOrganizerDashboard = async () => {
  const { data } = await api.get("/organizer/dashboard");
  return data;
};

export const getOrganizerEvents = async () => {
  const { data } = await api.get("/organizer/events");
  return data;
};

export const createOrganizerEvent = async (payload) => {
  const { data } = await api.post("/organizer/events", payload);
  return data;
};

export const updateOrganizerEvent = async (id, payload) => {
  const { data } = await api.put(`/organizer/events/${id}`, payload);
  return data;
};