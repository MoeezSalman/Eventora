import api from "./api";

export const getAllEvents = async () => {
  const { data } = await api.get("/events");
  return data;
};

export const getEventById = async (id) => {
  const { data } = await api.get(`/events/${id}`);
  return data;
};

export const getEventSeats = async (id) => {
  const { data } = await api.get(`/events/${id}/seats`);
  return data;
};