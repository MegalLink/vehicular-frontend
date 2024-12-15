import { useQuery } from '@tanstack/react-query'
import { sparePartsService, GetSparePartsParams } from '../services/spareParts'
import { QUERY_KEYS } from '../constants/query_keys'

export const useSparePartsQuery = (params: GetSparePartsParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.SPARE_PARTS.list(params),
    queryFn: () => sparePartsService.getSpareParts(params),
  })
}
