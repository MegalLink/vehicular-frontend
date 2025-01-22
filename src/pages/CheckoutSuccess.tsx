import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

export default function CheckoutSuccess() {
  const navigate = useNavigate()
  const { clearCart } = useCartStore()

  useEffect(() => {
    try {
      clearCart()
      console.log('Cart cleared successfully after payment')
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }, [clearCart])

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center">
        <CheckCircleIcon w={20} h={20} color="green.500" />
        <Heading>¡Pago exitoso!</Heading>
        <Text align="center">
          Tu pago ha sido procesado correctamente. Gracias por tu compra.
        </Text>
        <Text color="gray.600">
          Tu carrito ha sido limpiado y puedes realizar nuevas compras.
        </Text>
        <Box>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/orders')}
            size="lg"
          >
            Ver mis órdenes
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}
