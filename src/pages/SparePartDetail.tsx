import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Badge,
  Divider,
  HStack,
  useToast,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/query_keys'
import { sparePartsService } from '../services/spareParts'
import { formatPrice } from '../utils/formatters'
import Carousel from '../components/Carousel'

export default function SparePartDetail() {
  const { id } = useParams<{ id: string }>()
  const toast = useToast()

  const { data: sparePart, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.SPARE_PARTS.ID(id!),
    queryFn: () => sparePartsService.getSparePart(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="primary.500" />
      </Center>
    )
  }

  if (isError || !sparePart) {
    return (
      <Center h="50vh">
        <Text color="red.500">
          {error instanceof Error ? error.message : 'Error al cargar el repuesto'}
        </Text>
      </Center>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>{sparePart.name}</Heading>
          <HStack spacing={4}>
            <Badge colorScheme="blue">{sparePart.category}</Badge>
            <Badge colorScheme={sparePart.stock > 0 ? 'green' : 'red'}>
              {sparePart.stock > 0 ? 'En Stock' : 'Sin Stock'}
            </Badge>
            <Text color="gray.500">Código: {sparePart.code}</Text>
          </HStack>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          {/* Carrusel de Imágenes */}
          <Box>
            <Carousel images={sparePart.images} aspectRatio={4/3} />
          </Box>

          {/* Detalles */}
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color="primary.500">
                {formatPrice(sparePart.price)}
              </Text>
              <Text color="gray.600" mt={2}>
                Stock disponible: {sparePart.stock} unidades
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>Descripción</Text>
              <Text color="gray.700">{sparePart.description}</Text>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={2}>Especificaciones</Text>
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text color="gray.600">Marca</Text>
                  <Text fontWeight="medium">{sparePart.brand}</Text>
                </Box>
                <Box>
                  <Text color="gray.600">Modelo</Text>
                  <Text fontWeight="medium">{sparePart.brandModel}</Text>
                </Box>
                <Box>
                  <Text color="gray.600">Tipo</Text>
                  <Text fontWeight="medium">{sparePart.modelType}</Text>
                </Box>
                <Box>
                  <Text color="gray.600">Año</Text>
                  <Text fontWeight="medium">{sparePart.modelTypeYear}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />
          </VStack>
        </SimpleGrid>
      </VStack>
    </Container>
  )
}
