import { useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/query_keys'
import  {sparePartsService}  from '../services/spareParts'

export function useSparePartMutations() {
  const queryClient = useQueryClient()

  const invalidateSparePartQueries = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.SPARE_PARTS.ALL],
      refetchType: 'all'
    })
  }

  const createMutation = useMutation({
    mutationFn: sparePartsService.createSparePart,
    onSuccess: () => {
      invalidateSparePartQueries()
    },
  })

  const updateMutation = useMutation({
    mutationFn: sparePartsService.updateSparePart,
    onSuccess: () => {
      invalidateSparePartQueries()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: sparePartsService.deleteSparePart,
    onSuccess: () => {
      invalidateSparePartQueries()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
