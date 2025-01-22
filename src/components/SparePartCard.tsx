import { Box, Image, Text, VStack, IconButton, HStack, Button, useToast } from '@chakra-ui/react'
import { SparePart } from '../services/spareParts'
import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { formatPrice } from '../utils/formatters'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { FaShoppingCart } from 'react-icons/fa'

interface SparePartCardProps {
  sparePart: SparePart
}

export default function SparePartCard({ sparePart }: SparePartCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()
  const toast = useToast()
  const addItem = useCartStore((state) => state.addItem)

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === 0 ? sparePart.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => 
      prev === sparePart.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleImageDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  const handleCardClick = () => {
    navigate(`/repuestos/${sparePart._id}`)
  }

  const handleAddToCart = () => {
    addItem({
      id: sparePart._id,
      name: sparePart.name,
      price: sparePart.price,
      quantity: 1,
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

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ shadow: 'lg', cursor: 'pointer' }}
      transition="all 0.2s"
      onClick={handleCardClick}
    >
      <Box position="relative">
        <Image
          src={sparePart.images[currentImageIndex] || 'https://via.placeholder.com/200'}
          alt={`${sparePart.name} - imagen ${currentImageIndex + 1}`}
          height="200px"
          width="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/200"
        />
        {sparePart.images.length > 1 && (
          <>
            <IconButton
              aria-label="Imagen anterior"
              icon={<ChevronLeftIcon />}
              position="absolute"
              left="2"
              top="50%"
              transform="translateY(-50%)"
              onClick={handlePrevImage}
              bg="gray.600"
              color="white"
              _hover={{ bg: 'gray.700' }}
              size="sm"
            />
            <IconButton
              aria-label="Siguiente imagen"
              icon={<ChevronRightIcon />}
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              onClick={handleNextImage}
              bg="gray.600"
              color="white"
              _hover={{ bg: 'gray.700' }}
              size="sm"
            />
            <HStack 
              spacing={1} 
              position="absolute" 
              bottom="2" 
              left="50%" 
              transform="translateX(-50%)"
            >
              {sparePart.images.map((_, index) => (
                <Box
                  key={index}
                  w="2"
                  h="2"
                  borderRadius="full"
                  bg={index === currentImageIndex ? "gray.600" : "gray.400"}
                  cursor="pointer"
                  onClick={(e) => handleImageDotClick(e, index)}
                  _hover={{ bg: index === currentImageIndex ? "gray.700" : "gray.500" }}
                />
              ))}
            </HStack>
          </>
        )}
      </Box>

      <Box p="6">
        <VStack align="start" spacing={2}>
          <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
            {sparePart.name}
          </Text>
          <Text fontSize="2xl" color="primary.500" fontWeight="bold">
            {formatPrice(sparePart.price)}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Precio sin IVA
          </Text>
          <Button
            leftIcon={<FaShoppingCart />}
            colorScheme="blue"
            width="100%"
            onClick={handleAddToCart}
            isDisabled={sparePart.stock === 0}
          >
            Agregar al carrito
          </Button>
        </VStack>
      </Box>
    </Box>
  )
}
