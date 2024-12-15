import { Container, Heading, useToast, Spinner, Center } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import SparePartForm from '../../../components/spareparts/SparePartForm'
import { useSparePartMutations } from '../../../hooks/useSparePartMutations'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../constants/query_keys'
import { sparePartsService } from '../../../services/spareParts'

export default function EditarRepuesto() {
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams()
  const { updateMutation } = useSparePartMutations()

  const { data: sparePart, isLoading: isLoadingSparePart } = useQuery({
    queryKey: QUERY_KEYS.SPARE_PARTS.ID(id!),
    queryFn: () => sparePartsService.getSparePart(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id: id!, data })
      toast({
        title: 'Éxito',
        description: 'Repuesto actualizado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard/repuestos')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: JSON.stringify(error.response.data.message) || error.response?.data?.message || 'Error al actualizar el repuesto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (isLoadingSparePart || !sparePart) {
    return (
      <Center h="50vh">
        <Spinner 
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="primary.500"
          size="xl"
        />
      </Center>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Editar Repuesto</Heading>
      <SparePartForm 
        onSubmit={handleSubmit} 
        isLoading={updateMutation.isPending} 
        initialData={sparePart}
      />
    </Container>
  )
}
