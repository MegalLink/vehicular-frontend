import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Divider,
  HStack,
  Link,
  useDisclosure,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { useAuthStore } from '../../stores/authStore'
import { authService } from '../../services/auth'
import ResetPasswordModal from '../../components/ResetPasswordModal'
import Captcha from '../../components/Captcha'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      const response = await authService.login(formData)
      setAuth(response.token, {
        id: response._id,
        email: response.email,
        userName: response.userName,
        roles: response.roles
      })
      
      toast({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Redirigir según el rol
      const hasAdminAccess = response.roles.some(role => ['admin', 'employee'].includes(role))
      navigate(hasAdminAccess ? '/dashboard' : '/')
    } catch (error: any) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.response?.data?.message || 'Por favor verifica tus credenciales',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    authService.googleLogin()
  }

  const handleRegisterClick = () => {
    navigate('/register')
  }

  return (
    <Box maxW="400px" mx="auto" mt={8} p={6} borderRadius="lg" boxShadow="lg" bg="white">
      <VStack spacing={6} as="form" onSubmit={handleSubmit}>
        <Heading size="lg">Iniciar Sesión</Heading>
        
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Contraseña</FormLabel>
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="********"
          />
          <Link
            color="primary.500"
            fontSize="sm"
            onClick={onOpen}
            display="block"
            mt={2}
            _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Verificación</FormLabel>
          <Captcha onVerify={setIsCaptchaVerified} />
        </FormControl>

        <Button
          type="submit"
          colorScheme="primary"
          size="lg"
          width="full"
          isLoading={isLoading}
          loadingText="Iniciando sesión..."
          isDisabled={!isCaptchaVerified}
        >
          Iniciar Sesión
        </Button>

        <Divider />

        <Button
          leftIcon={<FaGoogle />}
          onClick={handleGoogleLogin}
          width="full"
          variant="outline"
          isDisabled={isLoading}
        >
          Continuar con Google
        </Button>

        <HStack spacing={1}>
          <Text>¿No tienes una cuenta?</Text>
          <Link
            color="primary.500"
            onClick={handleRegisterClick}
            _hover={{ textDecoration: 'underline' }}
          >
            Regístrate
          </Link>
        </HStack>
      </VStack>

      <ResetPasswordModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
