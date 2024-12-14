import { useMutation, useQueryClient } from '@tanstack/react-query'
import { brandService } from '../services/brand'
import { QUERY_KEYS } from '../constants/query_keys'
import { useToast } from '@chakra-ui/react'
import { getErrorMessage } from '../utils/error'
import {  UpdateBrandDto } from '../types/brand'

export function useBrandMutations() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const createMutation = useMutation({
    mutationFn: brandService.createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] })
      toast({
        title: 'Marca creada',
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
    mutationFn: ({ id, data }: { id: string; data: UpdateBrandDto }) =>
      brandService.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] })
      toast({
        title: 'Marca actualizada',
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
    mutationFn: brandService.deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BRANDS] })
      toast({
        title: 'Marca eliminada',
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
