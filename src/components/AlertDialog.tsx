import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { useRef } from 'react'

interface AlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  body: string
  confirmText?: string
  onConfirm: () => void
  isLoading?: boolean
}

export default function AlertDialog({
  isOpen,
  onClose,
  title,
  body,
  confirmText = 'Confirmar',
  onConfirm,
  isLoading = false,
}: AlertDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <ChakraAlertDialog
      isOpen={isOpen}
      // @ts-ignore
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>
            {body}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </ChakraAlertDialog>
  )
}
