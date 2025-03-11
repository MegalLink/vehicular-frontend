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
  useToast
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { orderService, Order, GetOrdersParams } from '../../services/order'
import { useState } from 'react'

export default function OrdenesCompra() {
  const toast = useToast()
  
  // Estado para los filtros
  const [filter, setFilter] = useState<GetOrdersParams>({})
  
  // Estado para los valores del formulario
  const [formValues, setFormValues] = useState({
    userID: '',
    paymentStatus: '',
    orderID: '',
    createdAt: ''
  })

  // Hook para obtener las órdenes usando React Query
  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', filter],
    queryFn: () => orderService.getOrders(filter),
  })

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Aplicar filtros
  const handleSearch = () => {
    // Crear un objeto de filtro con solo los valores no vacíos
    const newFilter: GetOrdersParams = {}
    
    if (formValues.userID.trim()) {
      newFilter.userID = formValues.userID.trim()
    }
    
    if (formValues.orderID.trim()) {
      newFilter.orderID = formValues.orderID.trim()
    }
    
    if (formValues.paymentStatus) {
      newFilter.paymentStatus = formValues.paymentStatus as 'Paid' | 'Pending' | 'Failed'
    }
    
    if (formValues.createdAt) {
      newFilter.createdAt = formValues.createdAt
    }
    
    // Actualizar el estado de filtro para activar la nueva consulta
    setFilter(newFilter)
    
    toast({
      title: 'Filtros aplicados',
      description: 'Buscando órdenes con los filtros seleccionados',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setFormValues({
      userID: '',
      paymentStatus: '',
      orderID: '',
      createdAt: ''
    })
    setFilter({})
    
    toast({
      title: 'Filtros eliminados',
      description: 'Mostrando todas las órdenes',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  // Función para mostrar el estado del pago con un badge de color
  const renderPaymentStatus = (status: string) => {
    let color = 'gray'
    
    switch(status) {
      case 'paid':
        color = 'green'
        break
      case 'not paid':
        color = 'yellow'
        break
    }
    
    return <Badge colorScheme={color}>{status}</Badge>
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando órdenes...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Heading size="lg">Órdenes de Compra</Heading>
        <Text color="red.500" mt={4}>Error al cargar las órdenes: {(error as Error).message}</Text>
      </Box>
    )
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>Órdenes de Compra</Heading>
      
      {/* Formulario de búsqueda */}
      <Box bg="white" p={4} borderRadius="md" shadow="sm" mb={6}>
        <Heading size="md" mb={4}>Filtros de búsqueda</Heading>
        
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={4}>
          <GridItem>
            <FormControl>
              <FormLabel>ID de Orden</FormLabel>
              <Input 
                name="orderID" 
                placeholder="Ingrese ID de orden" 
                value={formValues.orderID}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>ID de Usuario</FormLabel>
              <Input 
                name="userID" 
                placeholder="Ingrese ID de usuario" 
                value={formValues.userID}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Estado de Pago</FormLabel>
              <Select 
                name="paymentStatus" 
                placeholder="Seleccione estado" 
                value={formValues.paymentStatus}
                onChange={handleInputChange}
              >
                <option value="paid">Pagado</option>
                <option value="not paid">No pagado</option>
              </Select>
            </FormControl>
          </GridItem>
          
          <GridItem>
            <FormControl>
              <FormLabel>Fecha de Creación</FormLabel>
              <Input 
                name="createdAt" 
                type="date" 
                value={formValues.createdAt}
                onChange={handleInputChange}
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
      {orders && orders.length > 0 ? (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Cliente</Th>
                <Th>ID Usuario</Th>
                <Th>Total</Th>
                <Th>Estado de Pago</Th>
                <Th>ID de Pago</Th>
                <Th>Fecha</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map((order: Order) => (
                <Tr key={order.orderID}>
                  <Td>{order.orderID}</Td>
                  <Td>{`${order.userDetail.firstName} ${order.userDetail.lastName}`}</Td>
                  <Td>{order.userID}</Td>
                  <Td>${order.totalPrice.toFixed(2)}</Td>
                  <Td>{renderPaymentStatus(order.paymentStatus)}</Td>
                  <Td>{order.paymentID || 'N/A'}</Td>
                  <Td>{formatDate(order.createdAt)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Box textAlign="center" py={6} bg="white" borderRadius="md" shadow="sm">
          <Text>No hay órdenes disponibles con los filtros seleccionados</Text>
        </Box>
      )}
    </Box>
  )
}
