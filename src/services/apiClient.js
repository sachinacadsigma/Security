import axios from 'axios';

const getToken = () => {
  return localStorage.getItem('token');
};

// Set up API client
const apiClient = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Configure the API request
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer A7x!G2p@Q9#L`;
    }
    return config;
  },
  (error) => {
    // Log request error and reject
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
