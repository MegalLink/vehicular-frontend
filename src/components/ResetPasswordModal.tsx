import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { authService } from '../services/auth'
import Captcha from './Captcha'

interface ResetPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResetPasswordModal({ isOpen, onClose }: ResetPasswordModalProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const toast = useToast()

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await authService.resetPassword({ email })
      
      toast({
        title: 'Solicitud enviada',
        description: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      onClose()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al enviar la solicitud',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCaptchaVerify = (verified: boolean) => {
    setIsCaptchaVerified(verified)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Restablecer Contraseña</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo electrónico"
              />
            </FormControl>

            <Captcha onVerify={handleCaptchaVerify} />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="primary"
            isLoading={isLoading}
            isDisabled={!isCaptchaVerified || !email}
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
