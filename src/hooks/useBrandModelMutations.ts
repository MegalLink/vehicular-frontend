import { useMutation, useQueryClient } from '@tanstack/react-query'
import { brandService } from '../services/brand'
import { QUERY_KEYS } from '../constants/query_keys'
import { useToast } from '@chakra-ui/react'
import { getErrorMessage } from '../utils/error'
import { UpdateBrandModelDto } from '../types/brand'

export function useBrandModelMutations(brandId: string | null) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const createMutation = useMutation({
    mutationFn: brandService.createBrandModel,
    onSuccess: () => {
      if (brandId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRAND_MODELS, brandId] })
      }
      toast({
        title: 'Modelo creado',
        status: 'success',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error al crear',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandModelDto }) =>
      brandService.updateBrandModel(id, data),
    onSuccess: () => {
      if (brandId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRAND_MODELS, brandId] })
      }
      toast({
        title: 'Modelo actualizado',
        status: 'success',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error al actualizar',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: brandService.deleteBrandModel,
    onSuccess: () => {
      if (brandId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRAND_MODELS, brandId] })
      }
      toast({
        title: 'Modelo eliminado',
        status: 'success',
        duration: 3000,
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error al eliminar',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
      })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
