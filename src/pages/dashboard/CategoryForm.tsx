import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { Category, categoryService } from '../../services/categories'
import { QUERY_KEYS } from '../../constants/query_keys'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react'
import { getErrorMessage } from '../../utils/error'
import ImageUpload from '../../components/ImageUpload'
import { UseQueryOptions } from '@tanstack/react-query'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  title: z.string().min(1, 'El título es requerido'),
  image: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function CategoryForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()

  const queryOptions: UseQueryOptions<Category, Error, Category, (string | undefined)[]> = {
    queryKey: [QUERY_KEYS.CATEGORIES, id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided')
      const result = await categoryService.getCategory(id)
      return result
    },
    enabled: !!id,
  }

  const { data: category, isLoading: isLoadingCategory, error } = useQuery(queryOptions)

  if (error) {
    toast({
      title: 'Error',
      description: getErrorMessage(error),
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: category?.title || '',
      name: category?.name || '',
      image: category?.image || '',
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      toast({
        title: 'Éxito',
        description: 'Categoría creada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard/categorias')
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (!id) throw new Error('No ID provided')
      const payload = { ...data }

      console.log("Update payload:", payload);
    
      return categoryService.updateCategory(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      toast({
        title: 'Éxito',
        description: 'Categoría actualizada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard/categorias')
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const onSubmit = (data: CategoryFormData) => {
    if (id) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  if (isLoadingCategory) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Cargando...</Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box>
        <Heading size="lg" mb={6}>
          {id ? 'Editar' : 'Nueva'} Categoría
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Título</FormLabel>
              <Input {...register('title')} />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Nombre</FormLabel>
              <Input {...register('name')} />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.image}>
              <ImageUpload
                value={watch('image')}
                onChange={(url) => setValue('image', url)}
                error={errors.image?.message}
              />
            </FormControl>

            <HStack spacing={4}>
              <Button
                type="submit"
                colorScheme="primary"
                isLoading={createMutation.isPending || updateMutation.isPending}
              >
                {id ? 'Actualizar' : 'Crear'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </HStack>
          </VStack>
        </form>
      </Box>
    </Container>
  )
}
