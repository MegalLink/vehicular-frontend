import { useState } from 'react'
import {
  Box,
  IconButton,
  Image,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

interface CarouselProps {
  images: string[]
  aspectRatio?: number
}

export default function Carousel({ images, aspectRatio = 16/9 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const size = useBreakpointValue({ base: 'sm', md: 'md' })

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (!images.length) {
    return (
      <Box
        bg="gray.100"
        borderRadius="lg"
        p={8}
        textAlign="center"
        color="gray.500"
        aspectRatio={aspectRatio}
      >
        No hay imágenes disponibles
      </Box>
    )
  }

  return (
    <Box position="relative" width="100%">
      <Box
        position="relative"
        width="100%"
        paddingBottom={`${(1/aspectRatio) * 100}%`}
        overflow="hidden"
        borderRadius="lg"
      >
        <Image
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          objectFit="cover"
          transition="opacity 0.5s"
        />
      </Box>

      {images.length > 1 && (
        <>
          <IconButton
            aria-label="Imagen anterior"
            icon={<ChevronLeftIcon />}
            position="absolute"
            left="4"
            top="50%"
            transform="translateY(-50%)"
            onClick={handlePrevious}
            size={size}
            bg="blackAlpha.600"
            color="white"
            _hover={{ bg: 'blackAlpha.800' }}
          />
          <IconButton
            aria-label="Siguiente imagen"
            icon={<ChevronRightIcon />}
            position="absolute"
            right="4"
            top="50%"
            transform="translateY(-50%)"
            onClick={handleNext}
            size={size}
            bg="blackAlpha.600"
            color="white"
            _hover={{ bg: 'blackAlpha.800' }}
          />

          <HStack
            spacing={2}
            position="absolute"
            bottom="4"
            left="50%"
            transform="translateX(-50%)"
          >
            {images.map((_, index) => (
              <Box
                key={index}
                w={index === currentIndex ? "3" : "2"}
                h={index === currentIndex ? "3" : "2"}
                borderRadius="full"
                bg={index === currentIndex ? "white" : "whiteAlpha.700"}
                cursor="pointer"
                onClick={() => setCurrentIndex(index)}
                transition="all 0.2s"
                _hover={{ bg: "white" }}
              />
            ))}
          </HStack>
        </>
      )}
    </Box>
  )
}
