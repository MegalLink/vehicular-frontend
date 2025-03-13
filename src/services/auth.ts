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
  userName: string
  token: string
  _id: string
}

interface RegisterResponse {
  message: string
}

interface ResetPasswordData {
  email: string
}

interface ChangePasswordData {
  email: string
  password: string
  newPassword: string
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
    console.log("Getting auth status")
    const { data } = await axiosInstance.get<AuthResponse>('/auth/status')
    return data
  },

  googleLogin: () => {
    const directionRedirect=`${axiosInstance.defaults.baseURL}/auth/google`
    
    window.location.href = directionRedirect
  },

  resetPassword: async (resetData: ResetPasswordData) => {
    const { data } = await axiosInstance.post<{ message: string }>('/auth/reset-password', resetData)
    return data
  },

  changePassword: async (changeData: ChangePasswordData) => {
    const { data } = await axiosInstance.post<{ message: string }>('/auth/change-password', changeData)
    return data
  }
}
