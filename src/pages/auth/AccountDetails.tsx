import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Divider,
  useColorModeValue,
  HStack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
} from '@chakra-ui/react'
import { useAuthStore } from '../../stores/authStore'
import { useState, useEffect } from 'react'
import { UserDetail, userDetailsService } from '../../services/userDetails'

const initialUserDetail: Omit<UserDetail, '_id' | 'userID'> = {
  firstName: '',
  lastName: '',
  identityDocumentNumber: '',
  identityDocumentType: 'DNI',
  address: '',
  postalCode: '',
  city: '',
  province: '',
  phone: '',
}

export default function AccountDetails() {
  const { user } = useAuthStore()
  const toast = useToast()
  const bgColor = useColorModeValue('white', 'gray.800')
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [userDetails, setUserDetails] = useState<UserDetail[]>([])
  const [currentDetail, setCurrentDetail] = useState(initialUserDetail)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user?.roles.includes('user')) {
      fetchUserDetails()
    }
  }, [user])

  const fetchUserDetails = async () => {
    if (!user?.roles.includes('user')) return;
    
    try {
      setIsLoading(true)
      const response = await userDetailsService.getUserDetails()
      // Ensure response is an array
      const details = Array.isArray(response) ? response : []
      setUserDetails(details)
    } catch (error) {
      toast({
        id: 'fetch-details-error',
        title: 'Error',
        description: 'No se pudieron cargar los detalles del usuario',
        status: 'error',
        duration: 3000,
      })
      setUserDetails([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      if (isEditing) {
        await userDetailsService.updateUserDetail(editId, currentDetail)
        toast({
          id: 'update-details-success',
          title: 'Éxito',
          description: 'Detalles actualizados correctamente',
          status: 'success',
          duration: 3000,
        })
      } else {
        await userDetailsService.createUserDetail(currentDetail)
        toast({
          id: 'create-details-success',
          title: 'Éxito',
          description: 'Detalles agregados correctamente',
          status: 'success',
          duration: 3000,
        })
      }
      await fetchUserDetails()
      onClose()
      setCurrentDetail(initialUserDetail)
      setIsEditing(false)
    } catch (error) {
      toast({
        id: 'submit-details-error',
        title: 'Error',
        description: 'No se pudieron guardar los detalles',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (detail: UserDetail) => {
    if (!detail._id) return
    
    setCurrentDetail({
      firstName: detail.firstName,
      lastName: detail.lastName,
      identityDocumentNumber: detail.identityDocumentNumber,
      identityDocumentType: detail.identityDocumentType,
      address: detail.address,
      postalCode: detail.postalCode,
      city: detail.city,
      province: detail.province,
      phone: detail.phone,
    })
    setEditId(detail._id)
    setIsEditing(true)
    onOpen()
  }

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true)
      await userDetailsService.deleteUserDetail(id)
      toast({
        id: 'delete-details-success',
        title: 'Éxito',
        description: 'Detalle eliminado correctamente',
        status: 'success',
        duration: 3000,
      })
      await fetchUserDetails()
    } catch (error) {
      toast({
        id: 'delete-details-error',
        title: 'Error',
        description: 'No se pudo eliminar el detalle',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const userRole = user?.roles;

  return (
      <VStack
        spacing={6}
        align="stretch"
        bg={bgColor}
        p={8}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Box>
          <Heading size="lg" mb={2}>Detalles de la Cuenta</Heading>
          <Text color="gray.600">Administra tu información personal y seguridad</Text>
        </Box>

        <Divider />
        <Box>
  <Text fontWeight="medium" mb={2}>Información del Usuario</Text>
  <VStack align="start" spacing={2}>
    <Text><strong>Correo:</strong> {user.email}</Text>
    <Text><strong>Nombre de Usuario:</strong> {user.userName}</Text>
    <Text><strong>Roles:</strong> {user.roles.join(', ')}</Text>
  </VStack>
</Box>
<Divider my={4} />
        {userRole?.includes('user') && (
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text fontWeight="medium">Datos para facturación</Text>
              <Button 
                colorScheme="blue" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false)
                  setCurrentDetail(initialUserDetail)
                  onOpen()
                }}
                isLoading={isLoading}
              >
                Agregar datos de facturación
              </Button>
            </HStack>

            <VStack align="stretch" spacing={4}>
              {userDetails && userDetails.length > 0 ? (
                userDetails.map((detail) => (
                  <Box
                    key={detail._id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    position="relative"
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">{detail.firstName} {detail.lastName}</Text>
                      <HStack>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleEdit(detail)}
                          isLoading={isLoading}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => detail._id && handleDelete(detail._id)}
                          isLoading={isLoading}
                        >
                          Eliminar
                        </Button>
                      </HStack>
                    </HStack>
                    <Text>{detail.address}, {detail.city}, {detail.province}</Text>
                    <Text>{detail.identityDocumentType}: {detail.identityDocumentNumber}</Text>
                    <Text>{detail.phone}</Text>
                  </Box>
                ))
              ) : (
                <Text>No hay datos de facturación disponibles.</Text>
              )}
            </VStack>
          </Box>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditing ? 'Editar Detalle' : 'Agregar Detalle'}</ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    value={currentDetail.firstName}
                    onChange={(e) => setCurrentDetail({...currentDetail, firstName: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Apellido</FormLabel>
                  <Input
                    value={currentDetail.lastName}
                    onChange={(e) => setCurrentDetail({...currentDetail, lastName: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    value={currentDetail.identityDocumentType}
                    onChange={(e) => setCurrentDetail({...currentDetail, identityDocumentType: e.target.value})}
                  >
                    <option value="DNI">DNI</option>
                    <option value="PASSPORT">Pasaporte</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Número de Documento</FormLabel>
                  <Input
                    value={currentDetail.identityDocumentNumber}
                    onChange={(e) => setCurrentDetail({...currentDetail, identityDocumentNumber: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Dirección</FormLabel>
                  <Input
                    value={currentDetail.address}
                    onChange={(e) => setCurrentDetail({...currentDetail, address: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Código Postal</FormLabel>
                  <Input
                    value={currentDetail.postalCode}
                    onChange={(e) => setCurrentDetail({...currentDetail, postalCode: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Ciudad</FormLabel>
                  <Input
                    value={currentDetail.city}
                    onChange={(e) => setCurrentDetail({...currentDetail, city: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Provincia</FormLabel>
                  <Input
                    value={currentDetail.province}
                    onChange={(e) => setCurrentDetail({...currentDetail, province: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    value={currentDetail.phone}
                    onChange={(e) => setCurrentDetail({...currentDetail, phone: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
                Cancelar
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleSubmit}
                isLoading={isLoading}
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
  )
}
