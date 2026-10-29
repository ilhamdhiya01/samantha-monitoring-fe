import axios from "axios";

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Envelope error BE: { errors: [{ field, message }] }.
    const apiErrors = error.response?.data?.errors as
      { field: string; message: string }[] | undefined;
    const message = apiErrors?.[0]?.message;
    if (message) error.message = message;
    return Promise.reject(error);
  },
);

export default axiosInstance;
