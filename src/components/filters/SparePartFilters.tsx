import {
  VStack,
  Box,
  Text,
  Select,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants/query_keys'
import { brandService } from '../../services/brand'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'

interface SparePartFiltersProps {
  filters: {
    category?: string
    brand?: string
    brandModel?: string
    modelType?: string
    modelTypeYear?: string
  }
  onFilterChange: (filterName: string, value: string) => void
}

const YEARS = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => (new Date().getFullYear() - i).toString())

export default function SparePartFilters({ filters, onFilterChange }: SparePartFiltersProps) {
  // Obtener las categorias
  const { data: categories } = useCategoriesQuery()

  // Obtener las marcas
  const { data: brands } = useQuery({
    queryKey: [QUERY_KEYS.BRANDS],
    queryFn: () => brandService.getAllBrands(),
  })

  // Obtener los modelos de la marca seleccionada
  const { data: models } = useQuery({
    queryKey: [QUERY_KEYS.BRAND_MODELS, filters.brand],
    queryFn: () => {
      const brand = brands?.find(b => b.name === filters.brand)
      return brand ? brandService.getBrandModels(brand._id) : Promise.resolve([])
    },
    enabled: !!filters.brand && filters.brand !== 'Todos',
  })

  // Obtener los tipos de modelo
  const { data: modelTypes } = useQuery({
    queryKey: [QUERY_KEYS.MODEL_TYPES, filters.brandModel],
    queryFn: () => {
      const model = models?.find(m => m.name === filters.brandModel)
      return model ? brandService.getModelTypes(model._id) : Promise.resolve([])
    },
    enabled: !!filters.brandModel && filters.brandModel !== 'Todos',
  })

  return (
    <VStack spacing={4} align="stretch" w="100%" p={4}>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Filtros
        </Text>
      </Box>

      <FormControl>
        <FormLabel>Categoría</FormLabel>
        <Select
          value={filters.category || 'Todos'}
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <option value="Todos">Todas las categorías</option>
          {categories?.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Marca</FormLabel>
        <Select
          value={filters.brand || 'Todos'}
          onChange={(e) => onFilterChange('brand', e.target.value)}
        >
          <option value="Todos">Todas las marcas</option>
          {brands?.map((brand) => (
            <option key={brand._id} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isDisabled={!filters.brand || filters.brand === 'Todos'}>
        <FormLabel>Modelo</FormLabel>
        <Select
          value={filters.brandModel || 'Todos'}
          onChange={(e) => onFilterChange('brandModel', e.target.value)}
        >
          <option value="Todos">Todos los modelos</option>
          {models?.map((model) => (
            <option key={model._id} value={model.name}>
              {model.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isDisabled={!filters.brandModel || filters.brandModel === 'Todos'}>
        <FormLabel>Tipo</FormLabel>
        <Select
          value={filters.modelType || 'Todos'}
          onChange={(e) => onFilterChange('modelType', e.target.value)}
        >
          <option value="Todos">Todos los tipos</option>
          {modelTypes?.map((type) => (
            <option key={type._id} value={type.name}>
              {type.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Año</FormLabel>
        <Select
          value={filters.modelTypeYear || 'Todos'}
          onChange={(e) => onFilterChange('modelTypeYear', e.target.value)}
        >
          <option value="Todos">Todos los años</option>
          {YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </FormControl>
    </VStack>
  )
}
