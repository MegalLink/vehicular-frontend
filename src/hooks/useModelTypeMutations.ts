import { useMutation, useQueryClient } from '@tanstack/react-query'
import { brandService } from '../services/brand'
import { QUERY_KEYS } from '../constants/query_keys'
import { useToast } from '@chakra-ui/react'
import { getErrorMessage } from '../utils/error'
import { UpdateModelTypeDto } from '../types/brand'

export function useModelTypeMutations(modelId: string | null) {
  const queryClient = useQueryClient()
  const toast = useToast()

  const createMutation = useMutation({
    mutationFn: brandService.createModelType,
    onSuccess: () => {
      if (modelId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MODEL_TYPES, modelId] })
      }
      toast({
        title: 'Tipo creado',
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
    mutationFn: ({ id, data }: { id: string; data: UpdateModelTypeDto }) =>
      brandService.updateModelType(id, data),
    onSuccess: () => {
      if (modelId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MODEL_TYPES, modelId] })
      }
      toast({
        title: 'Tipo actualizado',
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
    mutationFn: brandService.deleteModelType,
    onSuccess: () => {
      if (modelId) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MODEL_TYPES, modelId] })
      }
      toast({
        title: 'Tipo eliminado',
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
