import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/auth'
import { useAuthStore } from '../../stores/authStore'

interface ChangePasswordForm {
  password: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordForm>()

  if (!user) {
    navigate('/login')
    return null
  }

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setIsLoading(true)
      await authService.changePassword({
        email: user.email,
        password: data.password,
        newPassword: data.newPassword,
      })

      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña ha sido actualizada exitosamente.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      navigate('/login')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al cambiar la contraseña',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={8}>
      <Box
        p={8}
        bg="white"
        boxShadow="sm"
        borderRadius="lg"
      >
        <Stack spacing={6}>
          <Heading size="lg" textAlign="center">Cambiar Contraseña</Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  type="email"
                  value={user.email}
                  isReadOnly
                  bg="gray.50"
                />
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Contraseña actual</FormLabel>
                <Input
                  type="password"
                  {...register('password', {
                    required: 'Este campo es requerido',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.password?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.newPassword}>
                <FormLabel>Nueva contraseña</FormLabel>
                <Input
                  type="password"
                  {...register('newPassword', {
                    required: 'Este campo es requerido',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.newPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirmar nueva contraseña</FormLabel>
                <Input
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Este campo es requerido',
                    validate: (value) =>
                      value === watch('newPassword') || 'Las contraseñas no coinciden',
                  })}
                />
                <FormErrorMessage>
                  {errors.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                w="full"
                isLoading={isLoading}
              >
                Cambiar Contraseña
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Container>
  )
}
