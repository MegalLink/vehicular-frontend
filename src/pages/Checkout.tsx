import {
  Box,
  Button,
  Container,
  Divider,
  HStack,
  Heading,
  IconButton,
  Image,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  VStack,
  useSteps,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  Card,
  CardBody,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import { useCartStore } from '../stores/cartStore'
import { FaTrash } from 'react-icons/fa'
import { UserDetail, userDetailsService } from '../services/userDetails'
import { useState, useEffect } from 'react'
import { orderService } from '../services/order'
import { STRIPE_TAX_RATE } from '../constants/env'

const steps = [
  { title: 'Carrito', description: 'Revisa tus productos' },
  { title: 'Datos de comprador', description: 'Selecciona datos de comprador' },
  { title: 'Pago', description: 'Realiza el pago' },
]

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

export default function Checkout() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })
  const [selectedUserDetail, setSelectedUserDetail] = useState<string>('')
  const toast = useToast()

  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [userDetails, setUserDetails] = useState<UserDetail[]>([])
  const [currentDetail, setCurrentDetail] = useState(initialUserDetail)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true)
      const response = await userDetailsService.getUserDetails()
      const details = Array.isArray(response) ? response : []
      setUserDetails(details)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los detalles del usuario',
        status: 'error',
        duration: 3000,
      })
      setUserDetails([])
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
          title: 'Éxito',
          description: 'Detalles actualizados correctamente',
          status: 'success',
          duration: 3000,
        })
      } else {
        await userDetailsService.createUserDetail(currentDetail)
        toast({
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

  const handleNext = async () => {
    if (activeStep === 1 && !selectedUserDetail) {
      toast({
        title: 'Selecciona datos de cobro',
        description: 'Debes seleccionar los datos para el cobro o crear unos nuevos',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (activeStep === 1) {
      try {
        setIsLoading(true)
        const order = {
          userDetailID: selectedUserDetail,
          items: items.map(item => ({
            code: item.code,
            quantity: item.quantity
          })),
        }

        await orderService.createOrder(order)
        toast({
          title: 'Orden creada',
          description: 'La orden se ha creado exitosamente',
          status: 'success',
          duration: 3000,
        })
        setActiveStep(activeStep + 1)
      } catch (error) {
        toast({
          title: 'Error',
          description: 'No se pudo crear la orden. Por favor, intenta de nuevo.',
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevious = () => {
    setActiveStep(activeStep - 1)
  }

  const subtotal = getTotalPrice()
  const iva = subtotal * STRIPE_TAX_RATE
  const total = subtotal + iva

  const handleCreateOrderAndPay = async () => {
    if (!selectedUserDetail) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una dirección de envío',
        status: 'error',
      })
      return
    }

    setIsCreatingOrder(true)
    setOrderError(null)

    try {
      // Create order
      const orderItems = items.map(item => ({
        code: item.code,
        quantity: item.quantity
      }))

      const order = await orderService.createOrder({
        userDetailID: selectedUserDetail,
        items: orderItems
      })

      // Create Stripe payment session
      const baseUrl = window.location.origin.replace(/\/$/, '')
      const successURL = `${baseUrl}/checkout-success`
      const cancelURL = `${baseUrl}/checkout-cancelled`

      const paymentSession = await orderService.createStripePayment({
        orderID: order.orderID,
        successURL,
        cancelURL,
        tax: STRIPE_TAX_RATE
      })

      // Redirect to Stripe checkout
      window.location.href = paymentSession.url
    } catch (error: any) {
      console.error('Payment error:', error)
      setOrderError(error?.response?.data?.message || 'Error al procesar la orden. Por favor intenta nuevamente.')
      toast({
        title: 'Error',
        description: Array.isArray(error?.response?.data?.message) 
          ? error.response.data.message.join(', ')
          : 'Hubo un error al procesar tu orden',
        status: 'error',
      })
    } finally {
      setIsCreatingOrder(false)
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get('status')
    const orderIdParam = urlParams.get('orderId')

    if (status === 'success' && orderIdParam) {
      toast({
        title: '¡Pago exitoso!',
        description: 'Tu orden ha sido procesada correctamente',
        status: 'success',
        duration: 5000,
      })
      // Clear cart and redirect to order confirmation
      // clearCart()
      // navigate(`/orders/${orderIdParam}`)
    } else if (status === 'cancelled') {
      toast({
        title: 'Pago cancelado',
        description: 'El pago ha sido cancelado',
        status: 'warning',
        duration: 5000,
      })
    }
  }, [])

  const renderCartStep = () => (
    <HStack align="start" spacing={8}>
      <VStack flex={2} align="stretch" spacing={4}>
        {items.map((item) => (
          <Box
            key={item.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            position="relative"
          >
            <HStack spacing={4}>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <VStack align="start" flex={1}>
                <Text fontWeight="bold">{item.name}</Text>
                <Text color="gray.600">
                  Precio: S/. {item.price.toFixed(2)}
                </Text>
                <HStack>
                  <NumberInput
                    value={item.quantity}
                    onChange={(_, value) => updateQuantity(item.id, value)}
                    min={1}
                    size="sm"
                    maxW="100px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <IconButton
                    aria-label="Eliminar"
                    icon={<FaTrash />}
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  />
                </HStack>
              </VStack>
              <Text fontWeight="bold">
                S/. {(item.price * item.quantity).toFixed(2)}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Card flex={1}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Resumen de la orden</Heading>
            <HStack justify="space-between">
              <Text>Subtotal:</Text>
              <Text>S/. {subtotal.toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>IVA ({STRIPE_TAX_RATE * 100}%):</Text>
              <Text>S/. {iva.toFixed(2)}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">S/. {total.toFixed(2)}</Text>
            </HStack>
            <Button
              colorScheme="blue"
              width="100%"
              onClick={handleNext}
              isDisabled={items.length === 0}
            >
              Confirmar y continuar
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </HStack>
  )

  const renderBuyerDetailsStep = () => (
    <VStack flex={2} align="stretch" spacing={4}>
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontWeight="medium">Seleccionar Datos para el cobro</Text>
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
            Agregar datos para cobro en linea
          </Button>
        </HStack>

        <VStack align="stretch" spacing={4}>
          {userDetails && userDetails.length > 0 ? (
            <RadioGroup onChange={setSelectedUserDetail} value={selectedUserDetail}>
              <VStack align="stretch" spacing={4}>
                {userDetails.map((detail) => (
                  <Box
                    key={detail._id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    position="relative"
                    bg={selectedUserDetail === detail._id ? 'blue.50' : 'white'}
                    cursor="pointer"
                  >
                    <HStack align="center" spacing={4}>
                      <Box display="flex" alignItems="center" height="100%">
                        <Radio value={detail._id || ''} />
                      </Box>
                      <VStack align="stretch" flex="1" spacing={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{detail.firstName} {detail.lastName}</Text>
                          <HStack>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(detail)
                              }}
                              isLoading={isLoading}
                            >
                              Editar
                            </Button>
                          </HStack>
                        </HStack>
                        <Text>Documento: {detail.identityDocumentType} - {detail.identityDocumentNumber}</Text>
                        <Text>Dirección: {detail.address}</Text>
                        <Text>Ciudad: {detail.city}, {detail.province}</Text>
                        <Text>Código Postal: {detail.postalCode}</Text>
                        <Text>Teléfono: {detail.phone}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </RadioGroup>
          ) : (
            <Box p={4} textAlign="center" color="gray.500">
              No hay datos de facturación disponibles
            </Box>
          )}
        </VStack>
      </Box>

      <HStack spacing={4} width="100%" mt={6}>
        <Button
          variant="outline"
          size="lg"
          width="50%"
          onClick={handlePrevious}
          isDisabled={activeStep === 0}
        >
          Regresar
        </Button>
        <Button
          colorScheme="blue"
          size="lg"
          width="50%"
          onClick={handleNext}
          isLoading={isLoading}
          isDisabled={!selectedUserDetail}
        >
          Continuar al pago
        </Button>
      </HStack>

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

  const renderPaymentStep = () => (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Resumen de la orden</Heading>

            {/* Productos seleccionados */}
            <Box>
              <Text fontWeight="medium" mb={2}>Productos:</Text>
              <VStack align="stretch" spacing={2} pl={2}>
                {items.map((item) => (
                  <HStack key={item.id} justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text>{item.name}</Text>
                      <Text fontSize="sm" color="gray.600">Cantidad: {item.quantity}</Text>
                    </VStack>
                    <Text>S/. {(item.price * item.quantity).toFixed(2)}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Resumen de precios */}
            <HStack justify="space-between">
              <Text>Datos de cobro:</Text>
              <Text></Text>
            </HStack>
            <Box p={4} borderWidth={1} borderRadius="md">
              {userDetails.map((detail) => {
                if (detail._id === selectedUserDetail) {
                  return (
                    <div key={detail._id}>
                      <Text>Nombre y Apellido: {detail.firstName} {detail.lastName}</Text>
                      <Text>Dirección: {detail.address}</Text>
                      <Text>Ciudad:  {detail.city}</Text>
                      <Text>Provincia: {detail.province}</Text>
                      <Text>Código Postal: {detail.postalCode}</Text>
                      <Text>Teléfono: {detail.phone}</Text>
                    </div>
                  )
                }
                return null
              })}
            </Box>
            
            <Divider />
            
            <HStack justify="space-between">
              <Text>Subtotal:</Text>
              <Text>S/. {subtotal.toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>IVA ({STRIPE_TAX_RATE * 100}%):</Text>
              <Text>S/. {iva.toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">S/. {total.toFixed(2)}</Text>
            </HStack>
            
            {orderError && (
              <Text color="red.500">{orderError}</Text>
            )}
            
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleCreateOrderAndPay}
              isLoading={isCreatingOrder}
              loadingText="Procesando..."
            >
              Proceder al pago
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return renderCartStep()
      case 1:
        return renderBuyerDetailsStep()
      case 2:
        return renderPaymentStep()
      default:
        return null
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Stepper index={activeStep} colorScheme="blue">
          {steps.map((step, index) => (
            <Step key={index} onClick={() => index < activeStep && setActiveStep(index)} cursor={index < activeStep ? 'pointer' : 'default'}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink="0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>

        <Box pt={8}>{renderStep()}</Box>
      </VStack>
    </Container>
  )
}
