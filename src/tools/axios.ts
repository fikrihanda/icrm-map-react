// eslint-disable-next-line import/named
import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

interface AxiosIns extends AxiosInstance {
  $get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  $post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

function createAxios() {
  const axios = Axios.create({
    baseURL: import.meta.env.VITE_APP_CRM_API,
    headers: {
      authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
    }
  }) as AxiosIns
  axios.$get = (url, config) => {
    return axios.get(url, config).then(res => res.data)
  }
  axios.$post = (url, data, config) => {
    return axios.post(url, data, config).then(res => res.data)
  }
  return axios
}

const axios = createAxios()

export default axios
