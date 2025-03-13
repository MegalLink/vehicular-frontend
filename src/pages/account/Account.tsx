import { 
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Container,
  Divider
} from '@chakra-ui/react'
import AccountDetails from '../auth/AccountDetails'
import Orders from '../auth/Orders'

export function AccountPage() {
  return (
    <Container maxW="container.lg" py={8}>
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Información Personal</Tab>
          <Tab>Mis Órdenes</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel>
            <Box py={4}>
              <AccountDetails />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box py={4}>
              <Orders />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Divider mt={8} />
    </Container>
  )
}