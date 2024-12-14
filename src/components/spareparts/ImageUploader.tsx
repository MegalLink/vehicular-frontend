import { useCallback, useState } from 'react'
import {
  Box,
  FormControl,
  FormLabel,
  Icon,
  Image,
  SimpleGrid,
  VStack,
  IconButton,
  useToast,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { DeleteIcon } from '@chakra-ui/icons'
import { sparePartsService } from '../../services/spareParts'

interface ImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ value = [], onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const toast = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    try {
      setIsUploading(true)
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        try {
          const imageUrl = await sparePartsService.uploadImage(formData)
          return imageUrl
        } catch (error) {
          console.error('Error uploading file:', file.name, error)
          toast({
            title: `Error al subir ${file.name}`,
            description: 'No se pudo subir la imagen',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
          return null
        }
      })

      const uploadedUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null)
      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls])
      }
    } catch (error) {
      console.error('Error in onDrop:', error)
      toast({
        title: 'Error al subir imágenes',
        description: 'Hubo un error al procesar las imágenes',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsUploading(false)
    }
  }, [value, onChange, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDropRejected: (fileRejections) => {
      fileRejections.forEach((rejection) => {
        const { errors } = rejection
        errors.forEach((error) => {
          toast({
            title: 'Error al subir imagen',
            description: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        })
      })
    }
  })

  const removeImage = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove))
  }

  return (
    <FormControl>
      <FormLabel>Imágenes</FormLabel>
      <VStack spacing={4} align="stretch">
        <Box
          {...getRootProps()}
          p={6}
          border="2px dashed"
          borderColor={isDragActive ? 'primary.500' : 'gray.200'}
          borderRadius="md"
          textAlign="center"
          cursor="pointer"
          bg={isDragActive ? 'gray.50' : 'white'}
          transition="all 0.2s"
          _hover={{
            borderColor: 'primary.500',
          }}
          position="relative"
        >
          <input {...getInputProps()} />
          <VStack spacing={2}>
            <Icon
              boxSize={8}
              color={isDragActive ? 'primary.500' : 'gray.400'}
              // @ts-ignore
              as={(props) => (
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  {...props}
                >
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  <path d="m3 12.5 4.778-4.778a2 2 0 0 1 2.828 0L15 12" />
                  <circle cx="18" cy="5" r="3" />
                </svg>
              )}
            />
            {isUploading ? (
              <VStack>
                <Spinner size="sm" color="primary.500" />
                <Text fontSize="sm">Subiendo imágenes...</Text>
              </VStack>
            ) : (
              <Text fontSize="sm">
                {isDragActive
                  ? 'Suelta las imágenes aquí'
                  : 'Arrastra y suelta las imágenes aquí o haz clic para seleccionar'}
              </Text>
            )}
            <Text fontSize="xs" color="gray.500">
              Formatos permitidos: JPG, PNG, WEBP. Tamaño máximo: 5MB
            </Text>
          </VStack>
        </Box>

        {value.length > 0 && (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
            {value.map((url, index) => (
              <Box key={index} position="relative" borderRadius="md" overflow="hidden">
                <Image
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  objectFit="cover"
                  w="full"
                  h="150px"
                />
                <IconButton
                  aria-label="Eliminar imagen"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => removeImage(index)}
                />
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </FormControl>
  )
}
