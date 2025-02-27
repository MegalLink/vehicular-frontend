import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth'
import Captcha from '../../components/Captcha'

export default function Register() {
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!isCaptchaVerified) {
      toast({
        title: 'Error',
        description: 'Por favor verifica el captcha',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await authService.register({ email, password, userName })
      toast({
        title: 'Cuenta creada',
        description: 'Porfavor confirme la creación de cuenta en su correo electrónico',
        status: 'success',
        duration: 10000,
        isClosable: true,
      })
      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear la cuenta',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <Container maxW="container.sm" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading>Registro</Heading>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre de Usuario</FormLabel>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Verificación</FormLabel>
              <Captcha onVerify={setIsCaptchaVerified} />
            </FormControl>

            <Button
              type="submit"
              colorScheme="primary"
              width="full"
              size="lg"
              isLoading={isLoading}
              loadingText="Creando cuenta..."
              isDisabled={!isCaptchaVerified}
            >
              Registrarse
            </Button>

            <Text textAlign="center">
              ¿Ya tienes una cuenta?{' '}
              <Link
                color="primary.500"
                onClick={handleLoginClick}
                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
              >
                Inicia sesión aquí
              </Link>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
