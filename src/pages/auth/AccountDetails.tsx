import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Divider,
  Badge,
  useColorModeValue,
  HStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function AccountDetails() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  if (!user) {
    return null
  }

  return (
    <Container maxW="container.md" py={8}>
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
          <Text fontWeight="medium" mb={2}>Información Personal</Text>
          <VStack align="start" spacing={4}>
            <Box>
              <Text color="gray.600" fontSize="sm">Correo electrónico</Text>
              <Text fontSize="lg">{user.email}</Text>
            </Box>
            <Box>
              <Text color="gray.600" fontSize="sm">Nombre de usuario</Text>
              <Text fontSize="lg">{user.userName}</Text>
            </Box>
            <Box>
              <Text color="gray.600" fontSize="sm">Roles</Text>
              <HStack spacing={2} mt={1}>
                {user.roles.map((role) => (
                  <Badge
                    key={role}
                    colorScheme={role === 'admin' ? 'red' : 'blue'}
                  >
                    {role}
                  </Badge>
                ))}
              </HStack>
            </Box>
          </VStack>
        </Box>

        <Divider />

        <Box>
          <Text fontWeight="medium" mb={4}>Seguridad</Text>
          <Button
            colorScheme="primary"
            variant="outline"
            onClick={() => navigate('/change-password')}
          >
            Cambiar Contraseña
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}
