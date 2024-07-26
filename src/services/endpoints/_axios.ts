import axios, {AxiosInstance, AxiosResponse as _AxiosResponse} from 'axios'

export const RequestHeaders = {
  'Content-Type': 'application/json'
}

const _axios: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: import.meta.env.VITE_TIMEOUT,
  headers: RequestHeaders,
})

export type AxiosResponse<T> = Partial<Omit<_AxiosResponse, 'data'>> & {
  data: T
}

export default _axios
