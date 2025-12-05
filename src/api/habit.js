import API from "./axios";

export const createHabit = (data) => API.post("/habit/create", data);
export const completeHabit = (id) => API.put(`/habit/complete/${id}`);
export const getHabitStatus = (id, date) => API.get(`/habit/get-status/${id}?date=${date}`);
export const getAllHabits = () => API.get("/habit/get-all");
