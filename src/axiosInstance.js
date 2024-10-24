import axios from "axios";

const instance=axios.create({
    // baseURL:"http://localhost:4000",
    baseURL:"https://transportmanagementsystem-backend-main.onrender.com"
})


export default instance;