import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  HStack,
  Spinner,
  Image,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { Brand, BrandModel } from '../../types/brand'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { brandService } from '../../services/brand'
import { QUERY_KEYS } from '../../constants/query_keys'
import BrandModelList from './BrandModelList'

interface BrandListProps {
  brands: Brand[] | undefined
  isLoading: boolean
  onAddBrand: () => void
  onEditBrand: (brand: Brand) => void
  onDeleteBrand: (brand: Brand) => void
  onAddModel: (brandId: string) => void
  onEditModel: (model: BrandModel, brandId: string) => void
  onDeleteModel: (model: BrandModel, brandId: string) => void
}

export default function BrandList({
  brands,
  isLoading,
  onAddBrand,
  onEditBrand,
  onDeleteBrand,
  onAddModel,
  onEditModel,
  onDeleteModel,
}: BrandListProps) {
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null)

  const { data: brandModels, isLoading: isLoadingModels } = useQuery({
    queryKey: [QUERY_KEYS.BRAND_MODELS, expandedBrand],
    queryFn: () => (expandedBrand ? brandService.getBrandModels(expandedBrand) : Promise.resolve([])),
    enabled: !!expandedBrand,
  })

  const handleToggleModels = (brandId: string) => {
    setExpandedBrand(expandedBrand === brandId ? null : brandId)
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          Marcas
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onAddBrand}>
          Agregar Marca
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" />
        </Flex>
      ) : brands && brands.length > 0 ? (
        <Flex direction="column" gap={4}>
          {brands.map((brand) => (
            <Box key={brand._id}>
              <Flex
                justify="space-between"
                align="center"
                bg="white"
                p={4}
                borderRadius="lg"
                boxShadow="sm"
                _hover={{ boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Flex align="center" gap={4}>
                  <IconButton
                    aria-label="Toggle models"
                    icon={expandedBrand === brand._id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleModels(brand._id)}
                  />
                  <Image
                    src={brand.image}
                    alt={brand.name}
                    boxSize="40px"
                    objectFit="contain"
                    fallbackSrc="https://via.placeholder.com/40"
                  />
                  <Text fontSize="lg" fontWeight="medium">
                    {brand.name}
                  </Text>
                </Flex>
                <HStack>
                  <IconButton
                    aria-label="Editar marca"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => onEditBrand(brand)}
                  />
                  <IconButton
                    aria-label="Eliminar marca"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDeleteBrand(brand)}
                  />
                </HStack>
              </Flex>
              {expandedBrand === brand._id && (
                <Box mt={2}>
                  <BrandModelList
                    brandId={brand._id}
                    models={brandModels}
                    isLoading={isLoadingModels}
                    onAddModel={() => onAddModel(brand._id)}
                    onEditModel={(model) => onEditModel(model, brand._id)}
                    onDeleteModel={(model) => onDeleteModel(model, brand._id)}
                  />
                </Box>
              )}
            </Box>
          ))}
        </Flex>
      ) : (
        <Flex
          direction="column"
          align="center"
          justify="center"
          py={12}
          bg="gray.50"
          borderRadius="lg"
        >
          <Text color="gray.500" fontSize="lg" mb={4}>
            No hay marcas disponibles
          </Text>
          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onAddBrand}>
            Agregar Primera Marca
          </Button>
        </Flex>
      )}
    </Box>
  )
}
