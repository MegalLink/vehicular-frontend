import axiosInstance from '../lib/axios'

export interface SparePart {
  _id: string
  code: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  brand: string
  brandModel: string
  modelType: string
  modelTypeYear: string
  userID: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface SparePartsResponse {
  count: number
  next: string | null
  previous: string | null
  results: SparePart[]
}

export interface CreateSparePartDto {
  name: string
  description: string
  price: number
  stock: number
  brandId: string
  modelId: string
  image: string
}

export interface UpdateSparePartDto {
  id: string
  data: Partial<CreateSparePartDto>
}

interface GetSparePartsParams {
  offset: number
  limit: number
  search?: string
}

export const sparePartsService = {
  // Get all spare parts with pagination and search
  getSpareParts: async ({ offset, limit, search }: GetSparePartsParams) => {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString(),
    })
    
    if (search) {
      params.append('search', search)
    }
    console.log("params send",params.toString())

    const { data } = await axiosInstance.get<SparePartsResponse>(`/spare-part?${params.toString()}`)
    return data
  },

  // Get a single spare part by ID
  getSparePart: async (id: string) => {
    const { data } = await axiosInstance.get<SparePart>(`/spare-part/${id}`)
    return data
  },

  // Create a new spare part
  createSparePart: async (sparePartData: CreateSparePartDto) => {
    const { data } = await axiosInstance.post<SparePart>('/spare-part', sparePartData)
    return data
  },

  // Update an existing spare part
  updateSparePart: async ({ id, data }: UpdateSparePartDto) => {
    const response = await axiosInstance.patch<SparePart>(`/spare-part/${id}`, data)
    return response.data
  },

  // Delete a spare part
  deleteSparePart: async (id: string) => {
    await axiosInstance.delete(`/spare-part/${id}`)
  },

  // Upload image
  uploadImage: async (formData: FormData): Promise<string> => {
    const { data } = await axiosInstance.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.url
  },
}
