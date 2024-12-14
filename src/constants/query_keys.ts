export const QUERY_KEYS = {
  CATEGORIES: 'categories',
  SPARE_PARTS: {
    ALL: 'spare_parts',
    ID: (id: string) => ['spare_parts', id],
    list: (offset: number, limit: number, search?: string) => ['spare_parts', offset, limit, search],
  },
  BRANDS: 'brands',
  BRAND_MODELS: 'brand_models',
  MODEL_TYPES: 'model_types',
} as const
