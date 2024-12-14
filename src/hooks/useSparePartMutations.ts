import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/query_keys'
import  {sparePartsService}  from '../services/spareParts'

export function useSparePartMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: sparePartsService.createSparePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPARE_PARTS] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: sparePartsService.updateSparePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPARE_PARTS] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: sparePartsService.deleteSparePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SPARE_PARTS] })
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
