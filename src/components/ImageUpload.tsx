import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState, useEffect } from 'react'
import { fileService } from '../services/files'
import { getErrorMessage } from '../utils/error'

interface ImageUploadProps {
  label?: string
  value?: string
  onChange: (url: string) => void
  error?: string
}

export default function ImageUpload({
  label = 'Imagen',
  value,
  onChange,
  error,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  // Actualizar el preview cuando cambia el valor
  useEffect(() => {
    if (value) {
      setPreview(value)
    }
  }, [value])

  const uploadMutation = useMutation({
    mutationFn: fileService.uploadImage,
    onSuccess: (data) => {
      onChange(data.fileUrl)
      setPreview(data.fileUrl)
      toast({
        title: 'Éxito',
        description: 'Imagen subida correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un archivo de imagen',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Subir archivo
    uploadMutation.mutate(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <VStack spacing={4} align="start">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
          ref={fileInputRef}
        />
        <Box
          borderWidth={2}
          borderStyle="dashed"
          borderRadius="md"
          p={4}
          w="full"
          textAlign="center"
          cursor="pointer"
          onClick={handleClick}
          _hover={{ bg: 'gray.50' }}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              maxH="200px"
              mx="auto"
              objectFit="contain"
            />
          ) : (
            'Haz clic o arrastra una imagen aquí'
          )}
        </Box>
        <Box>
          <Button
            size="sm"
            onClick={handleClick}
            isLoading={uploadMutation.isPending}
            mr={2}
          >
            {preview ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </Button>
          {preview && (
            <Button size="sm" colorScheme="red" onClick={handleRemove}>
              Eliminar
            </Button>
          )}
        </Box>
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </VStack>
    </FormControl>
  )
}
