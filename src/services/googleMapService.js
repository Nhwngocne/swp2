import axios from "axios";

const getDistanceMatrix = async (origin, destination, apiKey) => {
  const encodedOrigin = encodeURIComponent(origin);
  const encodedDestination = encodeURIComponent(destination);

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodedOrigin}&destinations=${encodedDestination}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Google Maps:", error);
    throw error;
  }
};

export default {
  getDistanceMatrix,
};
