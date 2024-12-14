import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { BrandModel, CreateBrandModelDto } from '../../types/brand';

interface BrandModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: CreateBrandModelDto;
  setFormData: (data: CreateBrandModelDto) => void;
  onSubmit: () => Promise<void>;
  isEdit?: boolean;
  isLoading?: boolean;
  model: BrandModel | null;
}

export default function BrandModelFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isEdit = false,
  isLoading = false,
  model,
}: BrandModelFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Editar' : 'Nuevo'} Modelo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired mb={4}>
            <FormLabel>Nombre del Modelo</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ingrese el nombre del modelo"
            />
          </FormControl>
          <FormControl isRequired mb={4}>
            <FormLabel>ID de la Marca</FormLabel>
            <Input
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
              placeholder="Ingrese el ID de la marca"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onSubmit}
            isLoading={isLoading}
            isDisabled={!formData.name || !formData.brandId}
          >
            {isEdit ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
