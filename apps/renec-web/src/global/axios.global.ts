import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  // Set your base URL and other configurations here
  baseURL: 'http://localhost:3000/api',
  // Add other axios configurations as needed
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
      return config;
    },
    (error) => {
      // Handle request error
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
  
  axiosInstance.interceptors.response.use(
    (response) => {
      // Modify response data or handle common success cases
      return response;
    },
    (error) => {
      // Handle response error
      if (error.response) {
        // Response received with non-2xx status code
        const { status, data } = error.response;
        const { message = 'An error occurred. Please try again.' } = data;

        toast.error(message);
        if (status === 401) {
          // Unauthorized, remove token from localStorage
          localStorage.setItem('token', '');
          localStorage.setItem('profile', '{}');
        }
        return Promise.resolve(true);
      } 

      // No response received, show default error toast
      console.error('Response error:', error);
      toast.error('An error occurred. Please try again.');
      return Promise.reject(error);
    }
  );

export default axiosInstance;