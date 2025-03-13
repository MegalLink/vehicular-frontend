import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  HStack,
  Heading,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../utils/formatters';
import { STRIPE_TAX_RATE } from '../../constants/env';

interface CartStepProps {
  onNext: () => void;
}

export const CartStep = ({ onNext }: CartStepProps) => {
  const { items, removeItem, updateQuantity } = useCartStore();

  // Calcular subtotal y total
  const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

  const total = items.reduce((acc, item) => {
    const priceWithTax = roundToTwoDecimals(item.price * (1 + STRIPE_TAX_RATE));
    return acc + roundToTwoDecimals(priceWithTax * item.quantity);
  }, 0);
  
  const subtotal = total / (1 + STRIPE_TAX_RATE);

  return (
    <HStack align="start" spacing={8}>
      <VStack flex={2} align="stretch" spacing={4}>
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
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
              )}
              <VStack align="start" flex={1}>
                <Text fontWeight="bold">{item.name}</Text>
                <Text color="gray.600">
                  Precio: {formatPrice(item.price)}
                </Text>
                <HStack>
                  <NumberInput
                    value={item.quantity}
                    onChange={(_, value) => updateQuantity(item.id, value)}
                    min={1}
                    size="sm"
                    maxW="100px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <IconButton
                    aria-label="Eliminar"
                    icon={<FaTrash />}
                    variant="ghost"
                    colorScheme="red"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  />
                </HStack>
              </VStack>
              <Text fontWeight="bold">
                {formatPrice(item.price * item.quantity)}
              </Text>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Card flex={1}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Resumen de la orden</Heading>
            <HStack justify="space-between">
              <Text>Subtotal:</Text>
              <Text>{formatPrice(subtotal)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text>IVA ({STRIPE_TAX_RATE*100}%):</Text>
              <Text>{formatPrice(subtotal * STRIPE_TAX_RATE)}</Text>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <Text fontWeight="bold">Total:</Text>
              <Text fontWeight="bold">{formatPrice(total)}</Text>
            </HStack>
            <Button
              colorScheme="blue"
              width="100%"
              onClick={onNext}
              isDisabled={items.length === 0}
            >
              Confirmar y continuar
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </HStack>
  );
};
