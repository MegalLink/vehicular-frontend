interface ApiError {
  message: string
  error?: string
  statusCode?: number
}

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as any).response
    if (response?.data?.message) {
      return response.data.message
    }
  }
  return 'Ha ocurrido un error inesperado'
}
