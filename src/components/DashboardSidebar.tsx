import { Box, VStack, Text } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { path: 'repuestos', label: 'Repuestos' },
  { path: 'categorias', label: 'Categorías' },
  { path: 'marcas', label: 'Marcas' },
  { path: 'usuarios', label: 'Usuarios' },
  { path: 'ordenes-compra', label: 'Órdenes de Compra' },
]

export default function DashboardSidebar() {
  return (
    <Box 
      as="aside" 
      w="250px" 
      bg="white" 
      h="100%" 
      py={5} 
      borderRight="1px" 
      borderColor="gray.200"
    >
      <VStack spacing={2} align="stretch">
        {menuItems.map(item => (
          <NavLink 
            key={item.path}
            to={`/dashboard/${item.path}`}
            style={({ isActive }) => ({
              display: 'block',
              padding: '8px 16px',
              backgroundColor: isActive ? 'var(--chakra-colors-primary-50)' : 'transparent',
              color: isActive ? 'var(--chakra-colors-primary-700)' : 'var(--chakra-colors-gray-700)',
              textDecoration: 'none',
            })}
          >
            <Text>{item.label}</Text>
          </NavLink>
        ))}
      </VStack>
    </Box>
  )
}
