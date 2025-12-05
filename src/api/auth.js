import axios from "./axios";

// Register user
export const registerUser = async (data) => {
  return await axios.post("/auth/register", data);
};

// Login user
export const loginUser = async (data) => {
  return await axios.post("/auth/login", data);
};
