import { useForm, Controller } from 'react-hook-form'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
  Image,
  HStack,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../constants/query_keys'
import { brandService } from '../../services/brand'
import { useEffect, useState, useMemo } from 'react'
import { SparePart } from '../../services/spareParts'
import ImageUploader from './ImageUploader'

interface SparePartFormData {
  code: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  brand: string
  brandModel: string
  modelType: string
  modelTypeYear: string
}

interface SparePartFormProps {
  initialData?: SparePart
  onSubmit: (data: SparePartFormData) => Promise<void>
  isLoading?: boolean
}

export default function SparePartForm({ initialData, onSubmit, isLoading = false }: SparePartFormProps) {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SparePartFormData>({
    defaultValues: {
      code: initialData?.code || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      category: initialData?.category || '',
      brand: initialData?.brand || '',
      brandModel: initialData?.brandModel || '',
      modelType: initialData?.modelType || '',
      modelTypeYear: initialData?.modelTypeYear || '',
      images: initialData?.images || [],
    },
  })

  const selectedBrand = watch('brand')
  const selectedBrandModel = watch('brandModel')
  const [selectedBrandId, setSelectedBrandId] = useState<string>('')
  const [selectedModelId, setSelectedModelId] = useState<string>('')

  // Obtener las marcas
  const { data: brands } = useQuery({
    queryKey: [QUERY_KEYS.BRANDS],
    queryFn: () => brandService.getAllBrands(),
  })

  // Obtener los modelos de la marca seleccionada
  const { data: models } = useQuery({
    queryKey: [QUERY_KEYS.BRAND_MODELS, selectedBrandId],
    queryFn: () => brandService.getBrandModels(selectedBrandId),
    enabled: !!selectedBrandId,
  })

  // Obtener los tipos de modelo
  const { data: modelTypes } = useQuery({
    queryKey: [QUERY_KEYS.MODEL_TYPES, selectedModelId],
    queryFn: () => brandService.getModelTypes(selectedModelId),
    enabled: !!selectedModelId,
  })

  // Actualizar el ID de la marca cuando cambia la selección
  useEffect(() => {
    const brand = brands?.find(b => b.name === selectedBrand)
    if (brand) {
      setSelectedBrandId(brand._id)
    } else {
      setSelectedBrandId('')
    }
  }, [selectedBrand, brands])

  // Actualizar el ID del modelo cuando cambia la selección
  useEffect(() => {
    const model = models?.find(m => m.name === selectedBrandModel)
    if (model) {
      setSelectedModelId(model._id)
      // Si hay datos iniciales y coinciden con el modelo actual, restaurar el tipo de modelo
      if (initialData && initialData.brandModel === selectedBrandModel) {
        setValue('modelType', initialData.modelType);
      }
    } else {
      setSelectedModelId('')
    }
  }, [selectedBrandModel, models, initialData, setValue])

  // Limpiar el modelo y tipo de modelo cuando cambia la marca
  useEffect(() => {
    if (!initialData || initialData.brand !== selectedBrand) {
      setValue('brandModel', '')
      setValue('modelType', '')
    }
  }, [selectedBrand, setValue, initialData])

  // Restaurar el tipo de modelo cuando se cargan los datos iniciales
  useEffect(() => {
    if (initialData && selectedBrandModel === initialData.brandModel) {
      setValue('modelType', initialData.modelType)
    }
  }, [initialData, selectedBrandModel, setValue])

  useEffect(() => {
    if (initialData) {
      // Reset form with all fields from initialData
      reset({
        code: initialData.code,
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        stock: initialData.stock,
        category: initialData.category,
        brand: initialData.brand,
        brandModel: initialData.brandModel,
        modelType: initialData.modelType,
        modelTypeYear: initialData.modelTypeYear,
        images: initialData.images,
      });
      
      // Ensure dependent fields are properly set
      if (initialData.brand) {
        setValue('brand', initialData.brand);
      }
      if (initialData.brandModel) {
        setValue('brandModel', initialData.brandModel);
      }
      if (initialData.modelType) {
        setValue('modelType', initialData.modelType);
      }
    }
  }, [initialData, reset, setValue]);

  // Generar array de años desde 1990 hasta el año actual
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years: number[] = []
    for (let year = currentYear; year >= 1990; year--) {
      years.push(year)
    }
    return years
  }, [])

  const cleanFormData = (data: SparePartFormData) => {
    const { _id, updatedAt, code, createdAt, updatedBy, ...cleanedData } = data as any;
    return cleanedData;
  };

  const handleFormSubmit = async (data: SparePartFormData) => {
    try {
      const cleanedData = cleanFormData(data);
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Hubo un error al guardar los datos',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} w="100%" maxW="600px" mx="auto">
      <VStack spacing={4}>
        <FormControl isInvalid={!!errors.code}>
          <FormLabel>Código</FormLabel>
          <Input
            {...register('code', {
              required: 'Este campo es requerido',
            })}
            isDisabled={!!initialData}
            bg={initialData ? 'gray.100' : 'white'}
            _disabled={{
              cursor: 'not-allowed',
              opacity: 0.7
            }}
          />
          <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.name}>
          <FormLabel>Nombre</FormLabel>
          <Input
            {...register('name', {
              required: 'Este campo es requerido',
              minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' },
            })}
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.description}>
          <FormLabel>Descripción</FormLabel>
          <Textarea
            {...register('description', {
              required: 'Este campo es requerido',
            })}
          />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.price}>
          <FormLabel>Precio</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('price', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'El precio debe ser mayor a 0' },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.stock}>
          <FormLabel>Stock</FormLabel>
          <NumberInput min={0}>
            <NumberInputField
              {...register('stock', {
                required: 'Este campo es requerido',
                min: { value: 0, message: 'El stock debe ser mayor o igual a 0' },
              })}
            />
          </NumberInput>
          <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.category}>
          <FormLabel>Categoría</FormLabel>
          <Select
            {...register('category', {
              required: 'Este campo es requerido',
            })}
          >
            <option value="">Seleccione una categoría</option>
            <option value="accesorios">Accesorios</option>
            <option value="repuestos">Repuestos</option>
            <option value="otros">Otros</option>
          </Select>
          <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.brand}>
          <FormLabel>Marca</FormLabel>
          <Select
            {...register('brand', {
              required: 'Este campo es requerido',
            })}
          >
            <option value="">Seleccione una marca</option>
            {brands?.map((brand) => (
              <option key={brand._id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.brand?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.brandModel}>
          <FormLabel>Modelo</FormLabel>
          <Select
            {...register('brandModel', {
              required: 'Este campo es requerido',
            })}
            isDisabled={!selectedBrandId}
          >
            <option value="">Seleccione un modelo</option>
            {models?.map((model) => (
              <option key={model._id} value={model.name}>
                {model.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.brandModel?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.modelType}>
          <FormLabel>Tipo de Modelo</FormLabel>
          <Select
            {...register('modelType', {
              required: 'Este campo es requerido',
            })}
            isDisabled={!selectedModelId}
          >
            <option value="">Seleccione un tipo de modelo</option>
            {modelTypes?.map((type) => (
              <option key={type._id} value={type.name}>
                {type.name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.modelType?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.modelTypeYear}>
          <FormLabel>Año del Modelo</FormLabel>
          <Select
            {...register('modelTypeYear', {
              required: 'Este campo es requerido',
            })}
          >
            <option value="">Seleccione un año</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.modelTypeYear?.message}</FormErrorMessage>
        </FormControl>

        <Controller
          name="images"
          control={control}
          rules={{ required: 'Debe subir al menos una imagen' }}
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.images}>
              <ImageUploader value={value} onChange={onChange} />
              <FormErrorMessage>
                {errors.images?.message}
              </FormErrorMessage>
            </FormControl>
          )}
        />

        <Button
          type="submit"
          colorScheme="primary"
          isLoading={isLoading}
          w="full"
        >
          {initialData ? 'Actualizar' : 'Crear'} Repuesto
        </Button>
      </VStack>
    </Box>
  )
}
