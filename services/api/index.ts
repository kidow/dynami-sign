import axios from 'axios'
import { baseURL } from 'services'
import { Params } from 'types'

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})
api.interceptors.response.use(({ data }) => data)

export const getSign = (params: Params) => api.get('/api/sign', { params })
