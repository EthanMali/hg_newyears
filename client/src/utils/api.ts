const API_BASE_URL = 'http://34.207.207.24:5000'

export const getApiBaseUrl = () => API_BASE_URL

export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}
