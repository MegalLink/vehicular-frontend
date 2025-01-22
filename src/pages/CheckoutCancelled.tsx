import { useNavigate } from 'react-router-dom'
import { Box, Container, Heading, Text, VStack, Button } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'

export default function CheckoutCancelled() {
  const navigate = useNavigate()

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center">
        <WarningIcon w={20} h={20} color="orange.500" />
        <Heading>Pago cancelado</Heading>
        <Text align="center">
          El proceso de pago ha sido cancelado. Puedes intentarlo nuevamente cuando lo desees.
        </Text>
        <Box>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/checkout')}
            size="lg"
          >
            Volver al checkout
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}
