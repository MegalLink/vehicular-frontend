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
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/query_keys'
import { sparePartsService } from '../services/spareParts'
import { formatPrice } from '../utils/formatters'
import Carousel from '../components/Carousel'
import { useCartStore } from '../stores/cartStore'
import { FaShoppingCart } from 'react-icons/fa'

export default function SparePartDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: sparePart, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.SPARE_PARTS.ID(id!),
    queryFn: () => sparePartsService.getSparePart(id!),
    enabled: !!id,
  })

  const [quantity, setQuantity] = useState(1)
  const toast = useToast()
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    if (!sparePart) return

    addItem({
      id: sparePart._id,
      name: sparePart.name,
      price: sparePart.price,
      quantity,
      code: sparePart.code,
      image: sparePart.images[0],
    })

    toast({
      title: 'Producto agregado',
      description: 'El producto se agregó al carrito correctamente',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

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

            <Box>
              <Text mb={2}>Cantidad:</Text>
              <NumberInput
                value={quantity}
                onChange={(_, value) => setQuantity(value)}
                min={1}
                max={sparePart.stock}
                isDisabled={sparePart.stock === 0}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>

            <Button
              leftIcon={<FaShoppingCart />}
              colorScheme="blue"
              size="lg"
              width="100%"
              onClick={handleAddToCart}
              isDisabled={sparePart.stock === 0}
            >
              Agregar al carrito
            </Button>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Container>
  )
}
