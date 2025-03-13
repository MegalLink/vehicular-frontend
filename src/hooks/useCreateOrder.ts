import { useMutation } from '@tanstack/react-query';
import { orderService } from '../services/order';
import { useToast } from '@chakra-ui/react';

export const useCreateOrder = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      toast({
        title: 'Orden creada',
        description: 'La orden se ha creado exitosamente',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo crear la orden. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 3000,
      });
    },
  });
};
