import { useQuery } from '@tanstack/react-query'
import { categoryService } from '../services/categories'
import { QUERY_KEYS } from '../constants/query_keys'

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryService.getCategories()
  })
}
