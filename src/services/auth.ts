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

export interface GetUserQueryParams{
    isActive?: boolean;
    rol?: string;
    email?: string;
}

export interface ResponseGetUser{
  _id: string;
  email: string;
  userName: string;
  isActive: boolean;
  roles: string[];
}

export enum ValidRoles {
  admin = 'admin',
  employee = 'employee',
  user = 'user'
}

export interface UpdateUserDto {
  roles?: Array<ValidRoles.employee | ValidRoles.user>;
  isActive?: boolean;
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
  },

  getUsers: async (queryParams: GetUserQueryParams = {}) => {
    const params = new URLSearchParams()
    
    if (queryParams.isActive !== undefined) {
      params.append('isActive', queryParams.isActive.toString())
    }
    
    if (queryParams.rol) {
      params.append('rol', queryParams.rol)
    }
    
    if (queryParams.email) {
      params.append('email', queryParams.email)
    }
    
    const { data } = await axiosInstance.get<ResponseGetUser[]>(`/auth/users${params.toString() ? `?${params.toString()}` : ''}`)
    return data
  },

  updateUser: async (userId: string, updateData: UpdateUserDto): Promise<ResponseGetUser> => {
    // Validar que los roles sean válidos (solo employee o user, no admin)
   
   console.log("userid",userId)
   
    if (updateData.roles) {
      const validRoles = [ValidRoles.employee, ValidRoles.user];
      
      // Verificar que todos los roles proporcionados sean válidos
      const allRolesValid = updateData.roles.every(role => 
        validRoles.includes(role)
      );
      
      if (!allRolesValid) {
        throw new Error(`Los roles deben ser uno de los siguientes valores: ${validRoles.join(', ')}`);
      }
    }
    
    const { data } = await axiosInstance.patch<ResponseGetUser>(`/auth/user/${userId}`, updateData);
    return data;
  }
}
