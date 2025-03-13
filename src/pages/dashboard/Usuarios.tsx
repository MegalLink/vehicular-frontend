import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge, 
  Spinner, 
  Text,
  TableContainer,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Grid,
  GridItem,
  Flex,
  useToast,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  IconButton,
  Radio,
  RadioGroup
} from '@chakra-ui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, GetUserQueryParams, ResponseGetUser, ValidRoles, UpdateUserDto } from '../../services/auth'
import { useState } from 'react'
import { EditIcon } from '@chakra-ui/icons'

// Definir una interfaz extendida para el estado del formulario de edición
interface EditFormState extends UpdateUserDto {
  roles: Array<ValidRoles.employee | ValidRoles.user>;
}

export default function Usuarios() {
  const toast = useToast()
  const queryClient = useQueryClient()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Estado para los filtros
  const [filter, setFilter] = useState<GetUserQueryParams>({})
  
  // Estado para los valores del formulario
  const [formValues, setFormValues] = useState({
    email: '',
    rol: '',
    isActive: undefined as boolean | undefined
  })

  // Estado para el usuario seleccionado para editar
  const [selectedUser, setSelectedUser] = useState<ResponseGetUser | null>(null)
  const [editFormValues, setEditFormValues] = useState<EditFormState>({
    roles: [],
    isActive: false
  })

  // Hook para obtener los usuarios usando React Query
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users', filter],
    queryFn: () => authService.getUsers(filter),
  })

  // Mutación para actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, updateData }: { userId: string, updateData: UpdateUserDto }) => 
      authService.updateUser(userId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Usuario actualizado',
        description: 'La información del usuario ha sido actualizada correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    },
    onError: (error) => {
      toast({
        title: 'Error al actualizar',
        description: `Ha ocurrido un error: ${(error as Error).message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  })

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Manejar cambios en el switch de estado activo
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setFormValues(prev => ({
      ...prev,
      isActive: checked === prev.isActive ? undefined : checked
    }))
  }

  // Aplicar filtros
  const handleSearch = () => {
    // Crear un objeto de filtro con solo los valores no vacíos
    const newFilter: GetUserQueryParams = {}
    
    if (formValues.email.trim()) {
      newFilter.email = formValues.email.trim()
    }
    
    if (formValues.rol) {
      newFilter.rol = formValues.rol
    }
    
    if (formValues.isActive !== undefined) {
      newFilter.isActive = formValues.isActive
    }
    
    // Actualizar el estado de filtro para activar la nueva consulta
    setFilter(newFilter)
    
    toast({
      title: 'Filtros aplicados',
      description: 'Buscando usuarios con los filtros seleccionados',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setFormValues({
      email: '',
      rol: '',
      isActive: undefined
    })
    setFilter({})
    
    toast({
      title: 'Filtros eliminados',
      description: 'Mostrando todos los usuarios',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  // Abrir modal para editar usuario
  const handleEditUser = (user: ResponseGetUser) => {
    setSelectedUser(user)
    
    // Determinar el rol principal del usuario (employee tiene prioridad sobre user)
    let selectedRole: ValidRoles.employee | ValidRoles.user | undefined;
    
    if (user.roles.includes(ValidRoles.employee)) {
      selectedRole = ValidRoles.employee;
    } else if (user.roles.includes(ValidRoles.user)) {
      selectedRole = ValidRoles.user;
    }
    
    setEditFormValues({
      roles: selectedRole ? [selectedRole] : [],
      isActive: user.isActive
    })
    
    onOpen()
  }

  // Manejar cambios en el formulario de edición para el switch
  const handleEditSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormValues(prev => ({
      ...prev,
      isActive: e.target.checked
    }))
  }
  
  // Manejar cambios en el radio group de roles
  const handleRoleChange = (value: string) => {
    // Convertir el valor string al tipo ValidRoles
    const role = value as ValidRoles.employee | ValidRoles.user;
    setEditFormValues(prev => ({
      ...prev,
      roles: [role]
    }))
  }

  // Guardar cambios del usuario
  const handleSaveUser = () => {
    if (!selectedUser) return
    
    updateUserMutation.mutate({
      userId: selectedUser._id,
      updateData: editFormValues
    })
  }

  // Renderizar badge para roles
  const renderRoleBadge = (roles: string[]) => {
    const roleColors: Record<string, string> = {
      admin: 'red',
      employee: 'purple',
      user: 'blue'
    }
    
    return roles.map((role, index) => (
      <Badge 
        key={index} 
        colorScheme={roleColors[role] || 'gray'} 
        mr={1}
      >
        {role}
      </Badge>
    ))
  }

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando usuarios...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Heading size="lg">Usuarios</Heading>
        <Text color="red.500" mt={4}>Error al cargar los usuarios: {(error as Error).message}</Text>
      </Box>
    )
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>Gestión de Usuarios</Heading>
      
      {/* Formulario de búsqueda */}
      <Box bg="white" p={4} borderRadius="md" shadow="sm" mb={6}>
        <Heading size="md" mb={4}>Filtros de búsqueda</Heading>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4} mb={4}>
          <GridItem>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input 
                name="email" 
                placeholder="Buscar por email" 
                value={formValues.email}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Rol</FormLabel>
              <Select 
                name="rol" 
                placeholder="Seleccione rol" 
                value={formValues.rol}
                onChange={handleInputChange}
              >
                <option value="admin">Administrador</option>
                <option value="employee">Empleado</option>
                <option value="user">Usuario</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl display="flex" alignItems="center" mt={8}>
              <FormLabel htmlFor="isActive" mb="0">
                Usuario Activo
              </FormLabel>
              <Switch 
                id="isActive" 
                isChecked={formValues.isActive}
                onChange={handleSwitchChange}
              />
            </FormControl>
          </GridItem>
        </Grid>
        
        <Flex justifyContent="flex-end" gap={3}>
          <Button colorScheme="gray" onClick={handleClearFilters}>
            Limpiar Filtros
          </Button>
          <Button colorScheme="blue" onClick={handleSearch}>
            Buscar
          </Button>
        </Flex>
      </Box>
      
      {/* Tabla de resultados */}
      {users && users.length > 0 ? (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Email</Th>
                <Th>Nombre de Usuario</Th>
                <Th>Roles</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user: ResponseGetUser) => (
                <Tr key={user._id}>
                  <Td>{user._id}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.userName}</Td>
                  <Td>{renderRoleBadge(user.roles)}</Td>
                  <Td>
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Editar usuario"
                      icon={<EditIcon />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEditUser(user)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign="center" py={6} bg="white" borderRadius="md" shadow="sm">
          <Text>No hay usuarios disponibles con los filtros seleccionados</Text>
        </Box>
      )}
      
      {/* Modal de edición de usuario */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedUser && (
              <>
                <Box mb={4}>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{selectedUser.email}</Text>
                </Box>
                
                <Box mb={4}>
                  <Text fontWeight="bold">Nombre de Usuario:</Text>
                  <Text>{selectedUser.userName}</Text>
                </Box>
                
                <FormControl mb={4}>
                  <FormLabel>Rol del Usuario</FormLabel>
                  <RadioGroup 
                    value={editFormValues.roles[0] ?? ''} 
                    onChange={handleRoleChange}
                  >
                    <Stack spacing={4} direction="column">
                      <Radio value={ValidRoles.employee}>Empleado</Radio>
                      <Radio value={ValidRoles.user}>Usuario</Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="edit-is-active" mb="0">
                    Usuario Activo
                  </FormLabel>
                  <Switch 
                    id="edit-is-active" 
                    isChecked={editFormValues.isActive}
                    onChange={handleEditSwitchChange}
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleSaveUser}
              isLoading={updateUserMutation.isPending}
              isDisabled={editFormValues.roles.length === 0}
            >
              Guardar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
