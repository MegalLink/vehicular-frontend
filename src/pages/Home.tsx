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
  Grid,
  GridItem,
  Box,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '@chakra-ui/icons'
import SparePartCard from '../components/SparePartCard'
import { useSparePartsQuery } from '../hooks/useSparePartsQuery'
import { useDebounce } from '../hooks/useDebounce'
import SparePartFilters from '../components/filters/SparePartFilters'

const ITEMS_PER_PAGE = 10

interface Filters {
  category?: string
  brand?: string
  brandModel?: string
  modelType?: string
  modelTypeYear?: string
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filters>({})
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  const { 
    data: sparePartsData,
    isLoading,
    isError,
    error,
  } = useSparePartsQuery({
    offset: currentPage * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
    minStock: 1,
    ...filters,
    category: filters.category === 'Todos' ? undefined : filters.category,
    brand: filters.brand === 'Todos' ? undefined : filters.brand,
    brandModel: filters.brandModel === 'Todos' ? undefined : filters.brandModel,
    modelType: filters.modelType === 'Todos' ? undefined : filters.modelType,
    modelTypeYear: filters.modelTypeYear === 'Todos' ? undefined : filters.modelTypeYear,
  })

  const totalPages = useMemo(() => {
    if (!sparePartsData?.count) return 0
    return Math.ceil(sparePartsData.count / ITEMS_PER_PAGE)
  }, [sparePartsData?.count])

  const pageRange = useMemo(() => {
    const range: number[] = []
    const maxPages = 5
    let start = Math.max(0, currentPage - Math.floor(maxPages / 2))
    const end = Math.min(start + maxPages - 1, totalPages - 1)
    
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
    setCurrentPage(0)
  }

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setCurrentPage(0)
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

  const availableSpareParts = sparePartsData?.results ?? []

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", md: "250px 1fr" }} gap={8}>
        <GridItem>
          <Box 
            position="sticky"
            top="20px"
            bg="white"
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor="gray.200"
          >
            <SparePartFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Box>
        </GridItem>

        <GridItem>
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
              <Text>No hay repuestos disponibles con los filtros seleccionados.</Text>
            ) : (
              <>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
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
        </GridItem>
      </Grid>
    </Container>
  )
}
