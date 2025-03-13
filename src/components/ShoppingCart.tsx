import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import { FaShoppingCart, FaTrash } from 'react-icons/fa'
import { useCartStore } from '../stores/cartStore'
import { useNavigate } from 'react-router-dom'

export default function ShoppingCart() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCartStore()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={onOpen}
        position="relative"
        padding={2}
      >
        <FaShoppingCart size={20} />
        {getTotalItems() > 0 && (
          <Box
            position="absolute"
            top="-2px"
            right="-2px"
            bg="red.500"
            color="white"
            borderRadius="full"
            w="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
          >
            {getTotalItems()}
          </Box>
        )}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Carrito de Compras</DrawerHeader>

          <DrawerBody>
            {items.length === 0 ? (
              <Text color="gray.500" textAlign="center" mt={10}>
                El carrito está vacío
              </Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {items.map((item) => (
                  <Box
                    key={item.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    position="relative"
                  >
                    <HStack spacing={4}>
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          boxSize="60px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )}
                      <VStack align="start" flex={1}>
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text color="gray.600">
                          Precio: S/. {item.price.toFixed(2)}
                        </Text>
                        <HStack>
                          <Button
                            size="xs"
                            onClick={() =>
                              updateQuantity(item.id, Math.max(0, item.quantity - 1))
                            }
                          >
                            -
                          </Button>
                          <Text>{item.quantity}</Text>
                          <Button
                            size="xs"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                        </HStack>
                      </VStack>
                      <IconButton
                        aria-label="Eliminar"
                        icon={<FaTrash />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeItem(item.id)}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <VStack width="100%" spacing={4}>
              <HStack justify="space-between" width="100%">
                <Text fontWeight="bold">Total (Sin iva):</Text>
                <Text fontWeight="bold">S/. {getTotalPrice().toFixed(2)}</Text>
              </HStack>
              <Button
                colorScheme="blue"
                width="100%"
                onClick={handleCheckout}
                isDisabled={items.length === 0}
              >
                Proceder al pago
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
