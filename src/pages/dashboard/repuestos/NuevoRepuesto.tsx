import { Container, Heading, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import SparePartForm from '../../../components/spareparts/SparePartForm'
import { useSparePartMutations } from '../../../hooks/useSparePartMutations'

export default function NuevoRepuesto() {
  const navigate = useNavigate()
  const toast = useToast()
  const { createMutation } = useSparePartMutations()

  const handleSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data)
      toast({
        title: 'Éxito',
        description: 'Repuesto creado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard/repuestos')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el repuesto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Nuevo Repuesto</Heading>
      <SparePartForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </Container>
  )
}
