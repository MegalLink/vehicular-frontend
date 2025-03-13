import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  Spinner,
  Text,
  VStack,
  useToast,
  Image,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { orderService, Order, UserOrderDetail } from '../../services/order';
import { formatPrice } from '../../utils/formatters';
import { STRIPE_TAX_RATE } from '../../constants/env';

interface PaymentStepProps {
  onPrevious: () => void;
  orderId: string;
  subtotal: number;
  total: number;
}

export const PaymentStep = ({ onPrevious, orderId, subtotal, total }: PaymentStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<UserOrderDetail | null>(null);
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (!orderId) {
        toast({
          title: 'Error',
          description: 'No se encontró la orden',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      try {
        setIsLoading(true);
        
        // Cargar los detalles de la orden
        const order = await orderService.getOrderById(orderId);
        setOrderDetails(order);
        
        // Cargar los detalles del usuario directamente desde la orden
        if (order && order.userDetail) {
          setUserDetails(order.userDetail);
        }
        
        // Crear sesión de pago de Stripe
        const baseUrl = window.location.origin.replace(/\/$/, '');
        const successURL = `${baseUrl}/checkout-success`;
        const cancelURL = `${baseUrl}/checkout-cancelled`;

        const paymentSession = await orderService.createStripePayment({
          orderID: orderId,
          successURL,
          cancelURL,
          tax: STRIPE_TAX_RATE
        });
        
        setPaymentUrl(paymentSession.url);
      } catch (error) {
        console.error('Error creating payment session:', error);
        toast({
          title: 'Error',
          description: 'No se pudo crear la sesión de pago',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [orderId, toast]);

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  return (
    <HStack align="start" spacing={8} alignItems="flex-start">
      <VStack flex={2} align="stretch" spacing={4}>
        {/* Información de la orden */}
        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>
            Resumen de la Orden #{orderId.substring(0, 8)}
          </Heading>

          {isLoading ? (
            <VStack py={8}>
              <Spinner size="xl" />
              <Text mt={4}>Cargando información de la orden...</Text>
            </VStack>
          ) : orderDetails ? (
            <VStack spacing={6} align="stretch">
              {/* Datos del comprador */}
              {userDetails && (
                <Box>
                  <Heading size="sm" mb={2}>Datos del Comprador</Heading>
                  <Box p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                    <Text><strong>Nombre:</strong> {userDetails.firstName} {userDetails.lastName}</Text>
                    <Text><strong>Documento:</strong> {userDetails.identityDocumentType} {userDetails.identityDocumentNumber}</Text>
                    <Text><strong>Dirección:</strong> {userDetails.address}</Text>
                    <Text><strong>Ciudad:</strong> {userDetails.city}, {userDetails.province}</Text>
                    <Text><strong>Código Postal:</strong> {userDetails.postalCode}</Text>
                    <Text><strong>Teléfono:</strong> {userDetails.phone}</Text>
                  </Box>
                </Box>
              )}
              
              {/* Productos */}
              <Box>
                <Heading size="sm" mb={2}>Productos</Heading>
                <VStack spacing={2} align="stretch">
                  {orderDetails.items && orderDetails.items.map((item, index) => (
                    <HStack key={index} p={2} borderWidth="1px" borderRadius="md">
                      <VStack align="start" flex={1} spacing={0}>
                        <Text fontWeight="bold">{item.name || item.code}</Text>
                        <Text fontSize="sm" color="gray.600">
                          Cantidad: {item.quantity} x {formatPrice(item.price || 0)}
                        </Text>
                      </VStack>
                      <Text fontWeight="bold">{formatPrice((item.price || 0) * item.quantity)}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
              
              {/* Estado de la orden */}
              <Box>
                <Heading size="sm" mb={2}>Estado de la Orden</Heading>
                <Box p={3} borderWidth="1px" borderRadius="md" bg="blue.50">
                  <Text><strong>Estado de pago:</strong> {orderDetails.paymentStatus || 'Pendiente'}</Text>
                  <Text><strong>Fecha de creación:</strong> {new Date(orderDetails.createdAt).toLocaleString()}</Text>
                </Box>
              </Box>
            </VStack>
          ) : (
            <Text color="red.500">
              No se pudo cargar la información de la orden.
            </Text>
          )}
        </Box>
        
        {/* Información de Pago */}
        <Box p={6} borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>
            Información de Pago
          </Heading>

          {isLoading ? (
            <VStack py={8}>
              <Spinner size="xl" />
              <Text mt={4}>Preparando la sesión de pago...</Text>
            </VStack>
          ) : paymentUrl ? (
            <VStack spacing={6} align="stretch">
              <Text>
                Tu orden ha sido creada correctamente. Haz clic en el botón a continuación 
                para proceder al pago seguro con Stripe.
              </Text>
              <Text fontWeight="medium">
                Serás redirigido a la plataforma de pago seguro de Stripe para completar 
                la transacción.
              </Text>
              <Button 
                colorScheme="green" 
                size="lg" 
                onClick={handlePayment}
                width="100%"
              >
                Proceder al Pago
              </Button>
            </VStack>
          ) : (
            <Text color="red.500">
              Hubo un problema al crear la sesión de pago. Por favor, intenta de nuevo.
            </Text>
          )}
        </Box>
      </VStack>

      <Card flex={1} position="sticky" top="20px">
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Resumen de la orden</Heading>
            <HStack justify="space-between">
              <Text>Subtotal:</Text>
              <Text>{formatPrice(subtotal)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>IVA ({STRIPE_TAX_RATE*100}%):</Text>
              <Text>{formatPrice(subtotal * STRIPE_TAX_RATE)}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">{formatPrice(total)}</Text>
            </HStack>
            <Button
              variant="outline"
              width="100%"
              onClick={onPrevious}
              isDisabled={isLoading}
            >
              Regresar
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </HStack>
  );
};
