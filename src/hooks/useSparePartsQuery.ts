import { useQuery } from '@tanstack/react-query'
import { sparePartsService } from '../services/spareParts'
import { QUERY_KEYS } from '../constants/query_keys'

export const useSparePartsQuery = (offset: number, limit: number, search?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SPARE_PARTS.list(offset, limit, search),
    queryFn: () => sparePartsService.getSpareParts({
      offset,
      limit,
      search,
    }),
  })
}
