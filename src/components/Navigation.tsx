import {
  Box,
  Button,
  Container,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import ShoppingCart from './ShoppingCart'

export default function Navigation() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleNavigate = (path: string) => {
    navigate(path)
  }

  return (
    <Box bg={bgColor} py={4} shadow="sm">
      <Container maxW="container.xl">
        <HStack justify="space-between">
          <Button variant="ghost" onClick={() => handleNavigate('/')}>
            Vehicular
          </Button>

          <HStack spacing={4}>
            <ShoppingCart />
            {user ? (
              <Menu>
                <MenuButton as={Button} variant="ghost">
                  {user.email}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleNavigate('/account')}>
                    Mi Cuenta
                  </MenuItem>
                  {user.roles.includes('admin') && (
                    <MenuItem onClick={() => handleNavigate('/dashboard')}>
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button colorScheme="blue" onClick={() => handleNavigate('/login')}>
                Iniciar Sesión
              </Button>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
