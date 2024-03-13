import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3002', //process.env
  timeout: 10000, 
});

export default instance;
