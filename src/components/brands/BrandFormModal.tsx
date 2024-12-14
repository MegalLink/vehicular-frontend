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
import ImageUpload from '../ImageUpload'

interface BrandFormModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    name: string
    image: string
  }
  setFormData: (data: { name: string; image: string }) => void
  onSubmit: () => void
  isEdit?: boolean
  isLoading?: boolean
}

export default function BrandFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isEdit = false,
  isLoading = false,
}: BrandFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEdit ? 'Editar' : 'Nueva'} Marca</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre de la marca"
            />
          </FormControl>
          <FormControl>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
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
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
