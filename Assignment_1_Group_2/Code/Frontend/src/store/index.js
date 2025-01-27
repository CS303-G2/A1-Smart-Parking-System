import api from "../api";

export const getUserInfo = async (token) => {
  if (!token) return null;
  try {
    const response = await api.get("/userInfo", {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the JWT token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
