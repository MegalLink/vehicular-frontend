import axiosInstance from '../lib/axios'

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  userName: string
}

interface AuthResponse {
  email: string
  roles: string[]
  token: string
  _id: string
}

interface RegisterResponse {
  message: string
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/signin', credentials)
    return data
  },

  register: async (userData: RegisterData) => {
    const { data } = await axiosInstance.post<RegisterResponse>('/auth/signup', userData)
    return data
  },

  getAuthStatus: async () => {
    const { data } = await axiosInstance.get<AuthResponse>('/auth/status')
    return data
  },

  googleLogin: () => {
    window.location.href = `${axiosInstance.defaults.baseURL}/auth/google`
  }
}
