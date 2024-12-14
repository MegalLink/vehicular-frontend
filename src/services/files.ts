import axiosInstance from '../lib/axios'

export interface UploadResponse {
  fileUrl: string
}

export const fileService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await axiosInstance.post<UploadResponse>('/files/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },
}
