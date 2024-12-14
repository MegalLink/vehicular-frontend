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

interface ModelTypeFormModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    name: string
  }
  setFormData: (data: { name: string }) => void
  onSubmit: () => void
  isEdit?: boolean
  isLoading?: boolean
}

export default function ModelTypeFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isEdit = false,
  isLoading = false,
}: ModelTypeFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Editar' : 'Nuevo'} Tipo de Modelo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nombre del Tipo</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="Ingrese el nombre del tipo"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onSubmit}
            isLoading={isLoading}
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
