import {
  Box,
  Button,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useToast,
  HStack,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { useCategoriesQuery } from '../../hooks/useCategoriesQuery'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, MutableRefObject } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../../services/categories'
import { QUERY_KEYS } from '../../constants/query_keys'
import { getErrorMessage } from '../../utils/error'

export default function Categorias() {
  const { data: categories, isLoading, error } = useCategoriesQuery()
  const toast = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedImage, setSelectedImage] = useState('')
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const { isOpen: isImageOpen, onOpen: onImageOpen, onClose: onImageClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null) as MutableRefObject<HTMLButtonElement | null>

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      toast({
        title: 'Éxito',
        description: 'Categoría eliminada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    },
  })

  const handleDelete = (id: string) => {
    setCategoryToDelete(id)
    onDeleteOpen()
  }

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete)
    }
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    onImageOpen()
  }

  const handleAdd = () => {
    navigate('/dashboard/categorias/nuevo')
  }

  const handleEdit = (id: string) => {
    navigate(`/dashboard/categorias/${id}`)
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Cargando categorías...</Text>
      </Container>
    )
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'No se pudieron cargar las categorías',
      status: 'error',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box>
        <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="lg">Categorías</Heading>
          <Button colorScheme="primary" onClick={handleAdd}>
            Agregar Categoría
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Título</Th>
              <Th>Nombre</Th>
              <Th>Imagen</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories?.map((category) => (
              <Tr key={category._id}>
                <Td>{category.title}</Td>
                <Td>{category.name}</Td>
                <Td>
                  {category.image && (
                    <Image
                      src={category.image}
                      alt={category.title}
                      boxSize="50px"
                      objectFit="cover"
                      cursor="pointer"
                      onClick={() => handleImageClick(category.image!)}
                      borderRadius="md"
                      _hover={{ opacity: 0.8 }}
                      fallback={<Box w="50px" h="50px" bg="gray.100" borderRadius="md" />}
                    />
                  )}
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleEdit(category._id)}
                    >
                      Editar
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(category._id)}
                      isLoading={deleteMutation.isPending && categoryToDelete === category._id}
                    >
                      Eliminar
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isImageOpen} onClose={onImageClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Image
              src={selectedImage}
              alt="Imagen de categoría"
              width="100%"
              height="auto"
              maxH="80vh"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isDeleteOpen}
        // @ts-expect-error - Type mismatch is expected for Chakra UI AlertDialog
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Categoría
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro? No podrás deshacer esta acción.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={confirmDelete}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  )
}
