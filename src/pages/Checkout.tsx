import {
  Box,
  Container,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  useToast,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useCreateOrder } from '../hooks/useCreateOrder';
import { CartStep } from '../components/checkout/CartStep';
import { UserDetailsStep } from '../components/checkout/UserDetailsStep';
import { PaymentStep } from '../components/checkout/PaymentStep';
import { useCartStore } from '../stores/cartStore';
import { userDetailsService, UserDetail } from '../services/userDetails';


const STRIPE_TAX_RATE = 0.15;

const steps = [
  { title: 'Carrito', description: 'Revisa tus productos' },
  { title: 'Datos de comprador', description: 'Selecciona datos de comprador' },
  { title: 'Pago', description: 'Realiza el pago' },
];

export default function Checkout() {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [orderId, setOrderId] = useState<string>('');
  const [selectedUserDetail, setSelectedUserDetail] = useState<string>('');
  const [userDetails, setUserDetails] = useState<UserDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { items } = useCartStore();
  const toast = useToast();
  const { mutateAsync: createOrder, isPending: isCreatingOrder } = useCreateOrder();

  // Función para calcular precios con impuestos
  const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

  const total = items.reduce((acc, item) => {
    const priceWithTax = roundToTwoDecimals(item.price * (1 + STRIPE_TAX_RATE));
    return acc + roundToTwoDecimals(priceWithTax * item.quantity);
  }, 0);
  
  const subtotal = total / (1 + STRIPE_TAX_RATE);

  // Cargar los detalles del usuario al inicio
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const details = await userDetailsService.getUserDetails();
        setUserDetails(details);
        if (details.length > 0 && details[0]._id) {
          setSelectedUserDetail(details[0]._id);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los datos del usuario',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [toast]);

  // Manejadores para navegar entre pasos
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  // Manejador para cuando se crea una orden
  const handleOrderCreated = (newOrderId: string) => {
    setOrderId(newOrderId);
    handleNext();
  };

  // Manejador para cuando se selecciona un detalle de usuario
  const handleUserDetailSelected = (detailId: string) => {
    setSelectedUserDetail(detailId);
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <CartStep onNext={handleNext} />;
      case 1:
        return (
          <UserDetailsStep
            onPrevious={handlePrevious}
            onOrderCreated={handleOrderCreated}
            selectedUserDetail={selectedUserDetail}
            onUserDetailSelected={handleUserDetailSelected}
            userDetails={userDetails}
            isLoading={isLoading}
            createOrder={createOrder}
            isCreatingOrder={isCreatingOrder}
            items={items}
            subtotal={subtotal}
            total={total}
          />
        );
      case 2:
        return (
          <PaymentStep
            onPrevious={handlePrevious}
            orderId={orderId}
            subtotal={subtotal}
            total={total}
          />
        );
      default:
        return <CartStep onNext={handleNext} />;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Stepper index={activeStep} mb={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>
            <Box flexShrink={0}>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {renderStep()}
    </Container>
  );
}
