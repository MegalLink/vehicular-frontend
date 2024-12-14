import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'

export default function Dashboard() {
  return (
    <Flex h="calc(100vh - 48px)">
      <DashboardSidebar />
      <Box flex="1" p={6} bg="gray.50" overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  )
}
