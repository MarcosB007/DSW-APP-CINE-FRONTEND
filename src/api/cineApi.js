import axios from 'axios';

const pruebaApi = axios.create({
    baseURL: 'http://localhost:3001/',
});

export default pruebaApi;
