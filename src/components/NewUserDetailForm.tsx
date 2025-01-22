import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { userDetailsService } from '../services/userDetails'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../constants/query_keys'

interface NewUserDetailFormProps {
  onSuccess: () => void
}

interface UserDetail {
  firstName: string
  lastName: string
  identityDocumentNumber: string
  identityDocumentType: string
  address: string
  postalCode: string
  city: string
  province: string
  phone: string
}

export default function NewUserDetailForm({ onSuccess }: NewUserDetailFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState<UserDetail>({
    firstName: '',
    lastName: '',
    identityDocumentNumber: '',
    identityDocumentType: '',
    address: '',
    postalCode: '',
    city: '',
    province: '',
    phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await userDetailsService.createUserDetail(formData)
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.USER_DETAILS.LIST],
      })
      toast({
        title: 'Dirección creada',
        description: 'La dirección se ha creado correctamente',
        status: 'success',
        duration: 3000,
      })
      onSuccess()
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'No se pudo crear la dirección. Por favor, intenta nuevamente.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Apellido</FormLabel>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Número de documento de identidad</FormLabel>
          <Input
            name="identityDocumentNumber"
            value={formData.identityDocumentNumber}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Tipo de documento de identidad</FormLabel>
          <Input
            name="identityDocumentType"
            value={formData.identityDocumentType}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Dirección</FormLabel>
          <Input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Código postal</FormLabel>
          <Input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Ciudad</FormLabel>
          <Input name="city" value={formData.city} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Provincia</FormLabel>
          <Input
            name="province"
            value={formData.province}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Teléfono</FormLabel>
          <Input name="phone" value={formData.phone} onChange={handleChange} />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          width="100%"
        >
          Guardar dirección
        </Button>
      </VStack>
    </form>
  )
}
