import axios from "axios";

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = import.meta.env.VITE_APP_OPENWEATHERMAP_API_KEY;

const get = (capital) => {
    return axios.get(`${baseUrl}?q=${capital}&appid=${apiKey}&units=metric`).then(response => response.data);
};

export default { get };