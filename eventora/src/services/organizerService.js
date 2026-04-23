import api from "./api";
import axios from "axios";

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
  const { data } = await api.patch(`/organizer/events/${id}`, payload);
  return data;
};

export const deleteOrganizerEvent = async (id) => {
  const { data } = await api.delete(`/organizer/events/${id}`);
  return data;
};