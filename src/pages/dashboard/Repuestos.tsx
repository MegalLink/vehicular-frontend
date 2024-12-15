import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  ButtonGroup,
  Text,
  Center,
  Spinner,
  useToast,
  useDisclosure,
} from '@chakra-ui/react'
import { 
  SearchIcon, 
  EditIcon, 
  DeleteIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  AddIcon,
} from '@chakra-ui/icons'
import { useSparePartsQuery } from '../../hooks/useSparePartsQuery'
import { useSparePartMutations } from '../../hooks/useSparePartMutations'
import { useDebounce } from '../../hooks/useDebounce'
import { useNavigate } from 'react-router-dom'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { SparePart } from '../../services/spareParts'

const ITEMS_PER_PAGE = 10

export default function Repuestos() {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSparePart, setSelectedSparePart] = useState<SparePart | null>(null)
  const debouncedSearch = useDebounce(searchTerm, 500)
  const toast = useToast()
  const navigate = useNavigate()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const { deleteMutation } = useSparePartMutations()
  
  const { 
    data: sparePartsData,
    isLoading,
    isError,
  } = useSparePartsQuery({
    offset: currentPage * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined
  })

  const totalPages = Math.ceil((sparePartsData?.count || 0) / ITEMS_PER_PAGE)

  const pageRange = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(0, Math.min(currentPage - 2, totalPages - 5))
    return start + i
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(0)
  }

  const handlePreviousPage = () => {
    if (sparePartsData?.previous) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (sparePartsData?.next) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handleDelete = async (sparePart: SparePart) => {
    setSelectedSparePart(sparePart)
    onDeleteOpen()
  }

  const handleConfirmDelete = async () => {
    if (!selectedSparePart) return

    try {
      await deleteMutation.mutateAsync(selectedSparePart._id)
      toast({
        title: 'Éxito',
        description: 'Repuesto eliminado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onDeleteClose()
    } catch (_) {
      // Error handled by the mutation
    }
  }

  const handleEdit = (id: string) => {
    navigate(`/dashboard/repuestos/${id}/editar`)
  }

  const handleAdd = () => {
    navigate('/dashboard/repuestos/nuevo')
  }

  if (isLoading) {
    return (
      <Center h="50vh">
        <Spinner size="xl" color="primary.500" />
      </Center>
    )
  }

  if (isError) {
    return (
      <Center h="50vh">
        <Text>Error al cargar los repuestos</Text>
      </Center>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading>Repuestos</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
          Nuevo Repuesto
        </Button>
      </Flex>

      <Box mb={6}>
        <InputGroup>
          <Input
            placeholder="Buscar repuestos..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <InputRightElement>
            <SearchIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nombre</Th>
              <Th>Descripción</Th>
              <Th>Precio</Th>
              <Th>Stock</Th>
              <Th>Marca</Th>
              <Th>Modelo</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sparePartsData?.results?.map((sparePart) => (
              <Tr key={sparePart._id}>
                <Td>{sparePart.name}</Td>
                <Td>{sparePart.description}</Td>
                <Td>${sparePart.price}</Td>
                <Td>{sparePart.stock}</Td>
                <Td>{sparePart.brand}</Td>
                <Td>{sparePart.brandModel}</Td>
                <Td>
                  <ButtonGroup variant="ghost" size="sm">
                    <IconButton
                      aria-label="Editar"
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => handleEdit(sparePart._id)}
                    />
                    <IconButton
                      aria-label="Eliminar"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(sparePart)}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justify="center" mt={6}>
        <ButtonGroup>
          <IconButton
            aria-label="Página anterior"
            icon={<ChevronLeftIcon />}
            onClick={handlePreviousPage}
            isDisabled={!sparePartsData?.previous}
          />
          {pageRange.map((page) => (
            <Button
              key={page}
              onClick={() => setCurrentPage(page)}
              colorScheme={currentPage === page ? 'blue' : undefined}
            >
              {page + 1}
            </Button>
          ))}
          <IconButton
            aria-label="Página siguiente"
            icon={<ChevronRightIcon />}
            onClick={handleNextPage}
            isDisabled={!sparePartsData?.next}
          />
        </ButtonGroup>
      </Flex>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        title="Eliminar Repuesto"
        description={`¿Estás seguro de que deseas eliminar el repuesto ${selectedSparePart?.name}?`}
      />
    </Container>
  )
}
