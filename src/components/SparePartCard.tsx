import { Box, Image, Text, VStack } from '@chakra-ui/react'
import { SparePart } from '../services/spareParts'

interface SparePartCardProps {
  sparePart: SparePart
}

export default function SparePartCard({ sparePart }: SparePartCardProps) {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <Image
        src={sparePart.images[0]}
        alt={sparePart.name}
        height="200px"
        width="100%"
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/200"
      />

      <Box p="6">
        <VStack align="start" spacing={2}>
          <Text fontWeight="semibold" fontSize="lg" noOfLines={2}>
            {sparePart.name}
          </Text>
          <Text fontSize="2xl" color="primary.500" fontWeight="bold">
            ${sparePart.price.toLocaleString('es-EC')}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Precio sin IVA
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}
