import { Container, Heading, useToast, Center, Spinner } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import SparePartForm from '../../../components/spareparts/SparePartForm'
import { useSparePartMutations } from '../../../hooks/useSparePartMutations'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../../constants/query_keys'
import { sparePartsService } from '../../../services/spareParts'

export default function EditarRepuesto() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { updateMutation } = useSparePartMutations()

  const { data: sparePart, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SPARE_PARTS.ID(id!),
    queryFn: () => sparePartsService.getSparePart(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: any) => {
    if (!id) return

    try {
      await updateMutation.mutateAsync({
        id,
        data,
      })
      toast({
        title: 'Éxito',
        description: 'Repuesto actualizado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/dashboard/repuestos')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el repuesto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="primary.500" />
      </Center>
    )
  }

  if (!sparePart) {
    return null
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Editar Repuesto</Heading>
      <SparePartForm
        initialData={sparePart}
        onSubmit={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </Container>
  )
}
