import axios from 'axios'
import { baseURL } from 'services'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})
api.interceptors.response.use(({ data }) => data)

export const getSign = () => api.get('/api/sign')
