import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { userDetailsService } from '../../services/userDetails';

// Definir interfaces localmente para evitar problemas de importación
interface UserDetail {
  _id?: string;
  userID?: string;
  firstName: string;
  lastName: string;
  identityDocumentNumber: string;
  identityDocumentType: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
}

interface CartItem {
  id: string;
  code: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface UserDetailsStepProps {
  onPrevious: () => void;
  onOrderCreated: (orderId: string) => void;
  selectedUserDetail: string;
  onUserDetailSelected: (detailId: string) => void;
  userDetails: UserDetail[];
  isLoading: boolean;
  createOrder: (order: any) => Promise<any>;
  isCreatingOrder: boolean;
  items: CartItem[];
  subtotal: number;
  total: number;
}

// Definimos una interfaz para los datos que se envían al crear o actualizar
interface UserDetailInput {
  firstName: string;
  lastName: string;
  identityDocumentNumber: string;
  identityDocumentType: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  phone: string;
}

const initialUserDetail: UserDetailInput = {
  firstName: '',
  lastName: '',
  identityDocumentNumber: '',
  identityDocumentType: 'DNI',
  address: '',
  postalCode: '',
  city: '',
  province: '',
  phone: '',
};

export const UserDetailsStep = ({
  onPrevious,
  onOrderCreated,
  selectedUserDetail,
  onUserDetailSelected,
  userDetails,
  isLoading,
  createOrder,
  isCreatingOrder,
  items
}: UserDetailsStepProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentDetail, setCurrentDetail] = useState<UserDetailInput>(initialUserDetail);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const toast = useToast();
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await userDetailsService.updateUserDetail(editId, currentDetail as any);
        toast({
          title: 'Éxito',
          description: 'Detalles actualizados correctamente',
          status: 'success',
          duration: 3000,
        });
      } else {
        await userDetailsService.createUserDetail(currentDetail as any);
        toast({
          title: 'Éxito',
          description: 'Detalles agregados correctamente',
          status: 'success',
          duration: 3000,
        });
      }
      
      // Recargar los detalles del usuario
      const details = await userDetailsService.getUserDetails();
      if (details.length > 0 && details[0]._id) {
        onUserDetailSelected(details[0]._id);
      }
      
      onClose();
      setCurrentDetail(initialUserDetail);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los detalles',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleEdit = (detail: UserDetail) => {
    if (!detail._id) return;
    
    setCurrentDetail({
      firstName: detail.firstName,
      lastName: detail.lastName,
      identityDocumentNumber: detail.identityDocumentNumber,
      identityDocumentType: detail.identityDocumentType,
      address: detail.address,
      postalCode: detail.postalCode,
      city: detail.city,
      province: detail.province,
      phone: detail.phone,
    });
    setEditId(detail._id);
    setIsEditing(true);
    onOpen();
  };

  const handleContinue = async () => {
    if (!selectedUserDetail) {
      toast({
        title: 'Selecciona datos de cobro',
        description: 'Debes seleccionar los datos para el cobro o crear unos nuevos',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      setOrderError(null);
      
      const order = {
        userDetailID: selectedUserDetail,
        items: items.map(item => ({
          code: item.code,
          quantity: item.quantity
        })),
      };

      const createdOrder = await createOrder(order);
      onOrderCreated(createdOrder.orderID);
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError('Hubo un error al crear la orden. Por favor, intenta de nuevo.');
      toast({
        title: 'Error',
        description: 'Hubo un error al crear la orden. Por favor, intenta de nuevo.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack flex={2} align="stretch" spacing={4}>
      <Box>
        <HStack justify="space-between" mb={4}>
          <Text fontWeight="medium">Seleccionar Datos para el cobro</Text>
          <Button 
            colorScheme="blue" 
            size="sm" 
            onClick={() => {
              setIsEditing(false);
              setCurrentDetail(initialUserDetail);
              onOpen();
            }}
            isLoading={isLoading}
          >
            Agregar datos para cobro en línea
          </Button>
        </HStack>

        <VStack align="stretch" spacing={4}>
          {userDetails && userDetails.length > 0 ? (
            <RadioGroup onChange={onUserDetailSelected} value={selectedUserDetail}>
              <VStack align="stretch" spacing={4}>
                {userDetails.map((detail) => (
                  <Box
                    key={detail._id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    position="relative"
                    bg={selectedUserDetail === detail._id ? 'blue.50' : 'white'}
                    cursor="pointer"
                  >
                    <HStack align="center" spacing={4}>
                      <Box display="flex" alignItems="center" height="100%">
                        <Radio value={detail._id || ''} />
                      </Box>
                      <VStack align="stretch" flex="1" spacing={2}>
                        <HStack justify="space-between">
                          <Text fontWeight="bold">{detail.firstName} {detail.lastName}</Text>
                          <HStack>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(detail);
                              }}
                              isLoading={isLoading}
                            >
                              Editar
                            </Button>
                          </HStack>
                        </HStack>
                        <Text>Documento: {detail.identityDocumentType} - {detail.identityDocumentNumber}</Text>
                        <Text>Dirección: {detail.address}</Text>
                        <Text>Ciudad: {detail.city}, {detail.province}</Text>
                        <Text>Código Postal: {detail.postalCode}</Text>
                        <Text>Teléfono: {detail.phone}</Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </RadioGroup>
          ) : (
            <Box p={4} textAlign="center" color="gray.500">
              No hay datos de facturación disponibles
            </Box>
          )}
        </VStack>
      </Box>

      <HStack spacing={4} width="100%" mt={6}>
        <Button
          variant="outline"
          size="lg"
          width="50%"
          onClick={onPrevious}
        >
          Regresar
        </Button>
        <Button
          colorScheme="blue"
          size="lg"
          width="50%"
          onClick={handleContinue}
          isLoading={isCreatingOrder}
          isDisabled={!selectedUserDetail}
        >
          Continuar al pago
        </Button>
      </HStack>

      {orderError && (
        <Text color="red.500" textAlign="center">{orderError}</Text>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Editar Detalle' : 'Agregar Detalle'}</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nombre</FormLabel>
                <Input
                  value={currentDetail.firstName}
                  onChange={(e) => setCurrentDetail({...currentDetail, firstName: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Apellido</FormLabel>
                <Input
                  value={currentDetail.lastName}
                  onChange={(e) => setCurrentDetail({...currentDetail, lastName: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tipo de Documento</FormLabel>
                <Select
                  value={currentDetail.identityDocumentType}
                  onChange={(e) => setCurrentDetail({...currentDetail, identityDocumentType: e.target.value})}
                >
                  <option value="DNI">DNI</option>
                  <option value="PASSPORT">Pasaporte</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Número de Documento</FormLabel>
                <Input
                  value={currentDetail.identityDocumentNumber}
                  onChange={(e) => setCurrentDetail({...currentDetail, identityDocumentNumber: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Dirección</FormLabel>
                <Input
                  value={currentDetail.address}
                  onChange={(e) => setCurrentDetail({...currentDetail, address: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Código Postal</FormLabel>
                <Input
                  value={currentDetail.postalCode}
                  onChange={(e) => setCurrentDetail({...currentDetail, postalCode: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Ciudad</FormLabel>
                <Input
                  value={currentDetail.city}
                  onChange={(e) => setCurrentDetail({...currentDetail, city: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Provincia</FormLabel>
                <Input
                  value={currentDetail.province}
                  onChange={(e) => setCurrentDetail({...currentDetail, province: e.target.value})}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  value={currentDetail.phone}
                  onChange={(e) => setCurrentDetail({...currentDetail, phone: e.target.value})}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
              Cancelar
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};
