import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast, Center, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAuthStore } from '../../stores/authStore'
import { authService } from '../../services/auth'
import axiosInstance from '../../lib/axios'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const setAuth = useAuthStore(state => state.setAuth)

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const token = searchParams.get('token')

      if (!token) {
        toast({
          title: 'Error de autenticación',
          description: 'No se pudo obtener el token de autenticación',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        navigate('/login')
        return
      }

      try {
        // Configurar el token en el header para la siguiente petición
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Obtener la información del usuario usando el token
        const response = await authService.getAuthStatus()
        
        // Guardar el token y la información del usuario en el store
        setAuth(token, {
          id: response._id,
          email: response.email,
          roles: response.roles
        })

        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Has iniciado sesión con Google correctamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })

        // Redirigir según el rol
        const hasAdminAccess = response.roles.some(role => ['admin', 'employee'].includes(role))
        navigate(hasAdminAccess ? '/dashboard' : '/')
      } catch (error) {
        // Limpiar el token en caso de error
        delete axiosInstance.defaults.headers.common['Authorization']
        
        toast({
          title: 'Error de autenticación',
          description: 'No se pudo completar el inicio de sesión con Google',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        navigate('/login')
      }
    }

    handleGoogleCallback()
  }, [searchParams, navigate, toast, setAuth])

  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Spinner size="xl" color="primary.500" />
        <Text>Completando inicio de sesión con Google...</Text>
      </VStack>
    </Center>
  )
}
