import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stack,
  Container,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  // Verificar si el usuario tiene acceso al dashboard
  const hasAdminAccess = user?.roles.some(role => ['admin', 'employee'].includes(role))

  return (
    <Box bg={useColorModeValue('white', 'gray.800')} px={4} shadow="sm">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Button variant="ghost" onClick={() => handleNavigate('/')}>
            Vehicular
          </Button>

          <Stack direction="row" spacing={4} alignItems="center">
            {isAuthenticated ? (
              <>
                {hasAdminAccess && (
                  <Button variant="ghost" onClick={() => handleNavigate('/dashboard')}>
                    Dashboard
                  </Button>
                )}
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="outline"
                  >
                    {user?.email}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => handleNavigate('/account')}>
                      Mi Cuenta
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/change-password')}>
                      Cambiar Contraseña
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                  </MenuList>
                </Menu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigate('/login')}>
                  Iniciar sesión
                </Button>
                <Button colorScheme="primary" onClick={() => handleNavigate('/register')}>
                  Registrarse
                </Button>
              </>
            )}
          </Stack>
        </Flex>
      </Container>
    </Box>
  )
}
