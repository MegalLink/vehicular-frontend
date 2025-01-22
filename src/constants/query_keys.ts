export const QUERY_KEYS = {
  CATEGORIES: 'categories',
  SPARE_PARTS: {
    ALL: 'spare_parts',
    ID: (id: string) => ['spare_parts', id],
    list: (params: { 
      offset: number
      limit: number
      search?: string
      category?: string
      minStock?: number
      minPrice?: number
      maxPrice?: number
      brand?: string
      brandModel?: string
      modelType?: string
      modelTypeYear?: string
    }) => ['spare_parts', 'list', params],
  },
  BRANDS: 'brands',
  BRAND_MODELS: 'brand_models',
  MODEL_TYPES: 'model_types',
  USER_DETAILS: {
    ALL: 'user_details',
    LIST: ['user_details', 'list'],
  },
} as const
