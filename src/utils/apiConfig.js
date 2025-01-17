import axios from 'axios';

// Set the base URL dynamically based on the environment
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
});

export default API;
