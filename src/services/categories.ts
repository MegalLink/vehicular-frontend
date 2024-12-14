import axiosInstance from '../lib/axios'

export interface Category {
  _id: string
  name: string
  title: string
  image?: string
}

export interface CreateCategoryDto {
  name: string
  title: string
  image?: string
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/category')
    return response.data
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/category/${id}`)
    return response.data
  },

  createCategory: async (data: CreateCategoryDto): Promise<Category> => {
    const response = await axiosInstance.post('/category', data)
    return response.data
  },

  updateCategory: async (id: string, data: Partial<CreateCategoryDto>): Promise<Category> => {
    const response = await axiosInstance.patch(`/category/${id}`, data)
    return response.data
  },

  deleteCategory: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/category/${id}`)
  }
}
