import axios from "axios"

const api = axios.create({
  baseURL: "https://sbev-admin.onrender.com/api", // change this to your backend url
  headers: {
    "Content-Type": "application/json"
  }
})

export default api
