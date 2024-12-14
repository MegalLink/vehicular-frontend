import { useState, useMemo } from 'react'
import {
  Container,
  SimpleGrid,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
  Button,
  HStack,
  ButtonGroup,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'
import SparePartCard from '../components/SparePartCard'
import { useSparePartsQuery } from '../hooks/useSparePartsQuery'
import { useDebounce } from '../hooks/useDebounce'

const ITEMS_PER_PAGE = 5

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  const { 
    data: sparePartsData,
    isLoading,
    isError,
    error,
  } = useSparePartsQuery(currentPage * ITEMS_PER_PAGE, ITEMS_PER_PAGE, debouncedSearch || undefined)

  const totalPages = useMemo(() => {
    if (!sparePartsData?.count) return 0
    return Math.ceil(sparePartsData.count / ITEMS_PER_PAGE)
  }, [sparePartsData?.count])

  // Calcula el rango de páginas a mostrar
  const pageRange = useMemo(() => {
    const range: number[] = []
    const maxPages = 5
    let start = Math.max(0, currentPage - Math.floor(maxPages / 2))
    const end = Math.min(start + maxPages - 1, totalPages - 1)
    
    // Ajustar el inicio si estamos cerca del final
    start = Math.max(0, Math.min(start, totalPages - maxPages))
    
    for (let i = start; i <= end; i++) {
      range.push(i)
    }
    return range
  }, [currentPage, totalPages])

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

  const handlePageClick = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(0) // Reset to first page when searching
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
        <Text color="red.500">
          {error instanceof Error ? error.message : 'Error al cargar los repuestos'}
        </Text>
      </Center>
    )
  }

  console.log('sparePartsData:', sparePartsData)
  const availableSpareParts = sparePartsData?.results ?? []
  console.log('availableSpareParts:', availableSpareParts)

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="xl">Repuestos Disponibles</Heading>
        
        <InputGroup>
          <Input
            placeholder="Buscar repuestos..."
            value={searchTerm}
            onChange={handleSearch}
            size="lg"
            borderRadius="lg"
          />
          <InputRightElement pointerEvents="none" height="100%">
            <SearchIcon color="gray.300" />
          </InputRightElement>
        </InputGroup>

        {availableSpareParts.length === 0 ? (
          <Text>No hay repuestos disponibles en este momento.</Text>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {availableSpareParts.map((sparePart) => (
                <SparePartCard key={sparePart._id} sparePart={sparePart} />
              ))}
            </SimpleGrid>
            
            <HStack justify="center" spacing={4}>
              <Button
                onClick={handlePreviousPage}
                isDisabled={!sparePartsData?.previous}
                colorScheme="primary"
                variant="outline"
                leftIcon={<Icon as={ChevronLeftIcon} w={5} h={5} />}
              >
                Anterior
              </Button>

              <ButtonGroup variant="outline" spacing="2">
                {pageRange.map((page) => (
                  <Button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    colorScheme="primary"
                    variant={currentPage === page ? "solid" : "outline"}
                  >
                    {page + 1}
                  </Button>
                ))}
              </ButtonGroup>

              <Button
                onClick={handleNextPage}
                isDisabled={!sparePartsData?.next}
                colorScheme="primary"
                variant="outline"
                rightIcon={<Icon as={ChevronRightIcon} w={5} h={5} />}
              >
                Siguiente
              </Button>
            </HStack>
          </>
        )}
      </VStack>
    </Container>
  )
}
