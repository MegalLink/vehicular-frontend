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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Divider,
  TableContainer
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { orderService, Order, OrderItem } from '../../services/order'
import { useAuthStore } from '../../stores/authStore'
import { STRIPE_TAX_RATE } from '../../constants/env'
import { formatPrice } from '../../utils/formatters'

export default function Orders() {
  const { user } = useAuthStore()
  
  // Función para redondear a dos decimales
  const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;
  
  // Hook para obtener las órdenes del usuario actual
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: () => orderService.getOrders({ userID: user?.id }),
    enabled: !!user?.id, // Solo ejecuta la consulta si existe un ID de usuario
  })

  // Función para mostrar el estado del pago con un badge de color
  const renderPaymentStatus = (status: string) => {
    let color = 'gray'
    
    switch(status) {
      case 'Paid':
        color = 'green'
        break
      case 'Pending':
        color = 'yellow'
        break
      case 'Failed':
        color = 'red'
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

  // Función para calcular el subtotal, impuesto y total de una orden
  const calculateOrderTotals = (items: OrderItem[]) => {
    // Calcular el total con impuestos incluidos (como en Checkout)
    const total = items.reduce((acc, item) => {
      const priceWithTax = roundToTwoDecimals((item.price || 0) * (1 + STRIPE_TAX_RATE));
      return acc + roundToTwoDecimals(priceWithTax * item.quantity);
    }, 0);
    
    // Calcular el subtotal (sin impuestos)
    const subtotal = roundToTwoDecimals(total / (1 + STRIPE_TAX_RATE));
    
    // Calcular el impuesto
    const tax = roundToTwoDecimals(total - subtotal);
    
    return { subtotal, tax, total };
  }

  // Renderizar los items de una orden
  const renderOrderItems = (items: OrderItem[]) => {
    const { subtotal, tax, total } = calculateOrderTotals(items);
    
    return (
      <>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Código</Th>
                <Th>Nombre</Th>
                <Th>Precio</Th>
                <Th>Cantidad</Th>
                <Th>Subtotal</Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((item, index) => (
                <Tr key={`${item.code}-${index}`}>
                  <Td>{item.code}</Td>
                  <Td>{item.name || 'N/A'}</Td>
                  <Td>{formatPrice(item.price || 0)}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{formatPrice((item.price || 0) * item.quantity)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex justifyContent="flex-end" mt={4} flexDirection="column" alignItems="flex-end">
          <Text fontWeight="medium">Subtotal: {formatPrice(subtotal)}</Text>
          <Text fontWeight="medium">IVA ({STRIPE_TAX_RATE * 100}%): {formatPrice(tax)}</Text>
          <Text fontWeight="bold" fontSize="lg">Total: {formatPrice(total)}</Text>
        </Flex>
      </>
    )
  }

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Cargando tus órdenes...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Heading size="lg">Mis Órdenes</Heading>
        <Text color="red.500" mt={4}>Error al cargar las órdenes: {(error as Error).message}</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Heading size="lg" mb={6}>Mis Órdenes</Heading>
      
      {orders && orders.length > 0 ? (
        <Accordion allowMultiple>
          {orders.map((order: Order) => (
            <AccordionItem key={order.orderID}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <Flex justifyContent="space-between" alignItems="center">
                      <Text fontWeight="bold">Orden #{order.orderID.slice(-8)}</Text>
                      <Flex gap={4}>
                        <Text>{formatDate(order.createdAt)}</Text>
                        <Text>{formatPrice(order.totalPrice)}</Text>
                        {renderPaymentStatus(order.paymentStatus)}
                      </Flex>
                    </Flex>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box mb={4}>
                  <Text fontWeight="bold" mb={2}>Detalles de la orden:</Text>
                  <Flex gap={4} flexWrap="wrap">
                    <Box>
                      <Text fontWeight="semibold">ID de Pago:</Text>
                      <Text>{order.paymentID || 'N/A'}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Fecha de Creación:</Text>
                      <Text>{formatDate(order.createdAt)}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Última Actualización:</Text>
                      <Text>{formatDate(order.updatedAt)}</Text>
                    </Box>
                  </Flex>
                </Box>
                
                <Divider my={4} />
                
                <Box mb={4}>
                  <Text fontWeight="bold" mb={2}>Información de Envío:</Text>
                  <Flex gap={4} flexWrap="wrap">
                    <Box>
                      <Text fontWeight="semibold">Nombre:</Text>
                      <Text>{`${order.userDetail.firstName} ${order.userDetail.lastName}`}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Documento:</Text>
                      <Text>{`${order.userDetail.identityDocumentType}: ${order.userDetail.identityDocumentNumber}`}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Dirección:</Text>
                      <Text>{`${order.userDetail.address}, ${order.userDetail.city}, ${order.userDetail.province}, ${order.userDetail.postalCode}`}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold">Teléfono:</Text>
                      <Text>{order.userDetail.phone}</Text>
                    </Box>
                  </Flex>
                </Box>
                
                <Divider my={4} />
                
                <Box>
                  <Text fontWeight="bold" mb={2}>Productos:</Text>
                  {renderOrderItems(order.items)}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Text>No tienes órdenes de compra</Text>
      )}
    </Box>
  )
}