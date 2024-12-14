import axiosInstance from '../lib/axios'
import {
  Brand,
  BrandModel,
  CreateBrandDto,
  CreateBrandModelDto,
  CreateModelTypeDto,
  ModelType,
  UpdateBrandDto,
  UpdateBrandModelDto,
  UpdateModelTypeDto,
} from '../types/brand'

export const brandService = {
  // Brand endpoints
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axiosInstance.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  createBrand: async (data: CreateBrandDto) => {
    const response = await axiosInstance.post<Brand>('/brand', data)
    return response.data
  },

  getAllBrands: async () => {
    const response = await axiosInstance.get<Brand[]>('/brand')
    return response.data
  },

  getBrandById: async (id: string) => {
    const response = await axiosInstance.get<Brand>(`/brand/${id}`)
    return response.data
  },

  updateBrand: async (id: string, data: UpdateBrandDto) => {
    const response = await axiosInstance.patch<Brand>(`/brand/${id}`, data)
    return response.data
  },

  deleteBrand: async (id: string) => {
    const response = await axiosInstance.delete<Brand>(`/brand/${id}`)
    return response.data
  },

  // Brand Model endpoints
  createBrandModel: async (data: CreateBrandModelDto) => {
    const response = await axiosInstance.post<BrandModel>('/brand/model', data)
    return response.data
  },

  getBrandModels: async (brandId: string) => {
    const response = await axiosInstance.get<BrandModel[]>(`/brand/model/all?brandId=${brandId}`)
    return response.data
  },

  updateBrandModel: async (id: string, data: UpdateBrandModelDto) => {
    const response = await axiosInstance.patch<BrandModel>(`/brand/model/${id}`, data)
    return response.data
  },

  deleteBrandModel: async (id: string) => {
    const response = await axiosInstance.delete<BrandModel>(`/brand/model/${id}`)
    return response.data
  },

  // Model Type endpoints
  createModelType: async (data: CreateModelTypeDto) => {
    const response = await axiosInstance.post<ModelType>('/brand/model/type', data)
    return response.data
  },

  getModelTypes: async (modelId: string) => {
    const response = await axiosInstance.get<ModelType[]>(`/brand/model/type/all?modelId=${modelId}`)
    return response.data
  },

  updateModelType: async (id: string, data: UpdateModelTypeDto) => {
    const response = await axiosInstance.patch<ModelType>(`/brand/model/type/${id}`, data)
    return response.data
  },

  deleteModelType: async (id: string) => {
    const response = await axiosInstance.delete<ModelType>(`/brand/model/type/${id}`)
    return response.data
  },
}
