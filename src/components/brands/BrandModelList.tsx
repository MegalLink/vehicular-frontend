import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  HStack,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons'
import { BrandModel, ModelType } from '../../types/brand'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { brandService } from '../../services/brand'
import { QUERY_KEYS } from '../../constants/query_keys'
import ModelTypeList from './ModelTypeList'
import ModelTypeFormModal from './ModelTypeFormModal'
import { useModelTypeMutations } from '../../hooks/useModelTypeMutations'
import AlertDialog from '../AlertDialog'

interface BrandModelListProps {
  brandId: string
  models: BrandModel[] | undefined
  isLoading: boolean
  onAddModel: (brandId: string) => void
  onEditModel: (model: BrandModel) => void
  onDeleteModel: (model: BrandModel) => void
}

export default function BrandModelList({
  brandId,
  models,
  isLoading,
  onAddModel,
  onEditModel,
  onDeleteModel,
}: BrandModelListProps) {
  const [expandedModel, setExpandedModel] = useState<string | null>(null)
  const [selectedModelType, setSelectedModelType] = useState<ModelType | null>(null)
  const [modelTypeFormData, setModelTypeFormData] = useState({
    name: '',
  })

  const {
    isOpen: isAddTypeOpen,
    onOpen: onAddTypeOpen,
    onClose: onAddTypeClose,
  } = useDisclosure()
  const {
    isOpen: isEditTypeOpen,
    onOpen: onEditTypeOpen,
    onClose: onEditTypeClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteTypeOpen,
    onOpen: onDeleteTypeOpen,
    onClose: onDeleteTypeClose,
  } = useDisclosure()

  const { data: modelTypes, isLoading: isLoadingTypes } = useQuery({
    queryKey: [QUERY_KEYS.MODEL_TYPES, expandedModel],
    queryFn: () => (expandedModel ? brandService.getModelTypes(expandedModel) : Promise.resolve([])),
    enabled: !!expandedModel,
  })

  const { createMutation, updateMutation, deleteMutation } = useModelTypeMutations(expandedModel)

  const handleToggleTypes = (modelId: string) => {
    setExpandedModel(expandedModel === modelId ? null : modelId)
  }

  const handleAddType = (modelId: string) => {
    setModelTypeFormData({
      name: '',
    })
    setExpandedModel(modelId)
    onAddTypeOpen()
  }

  const handleEditType = (type: ModelType) => {
    setSelectedModelType(type)
    setModelTypeFormData({
      name: type.name,
    })
    onEditTypeOpen()
  }

  const handleDeleteType = (type: ModelType) => {
    setSelectedModelType(type)
    onDeleteTypeOpen()
  }

  const handleCreateType = () => {
    if (!expandedModel) return
    createMutation.mutate(
      {
        modelId: expandedModel,
        name: modelTypeFormData.name,
      },
      {
        onSuccess: () => onAddTypeClose(),
      },
    )
  }

  const handleUpdateType = () => {
    if (!selectedModelType) return
    updateMutation.mutate(
      {
        id: selectedModelType._id,
        data: modelTypeFormData,
      },
      {
        onSuccess: () => onEditTypeClose(),
      },
    )
  }

  const handleConfirmDeleteType = () => {
    if (!selectedModelType) return
    deleteMutation.mutate(selectedModelType._id, {
      onSuccess: () => onDeleteTypeClose(),
    })
  }

  return (
    <Box p={4} bg="gray.50">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontWeight="bold">Modelos</Text>
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={() => onAddModel(brandId)}
        >
          Nuevo Modelo
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py={4}>
          <Spinner />
        </Flex>
      ) : models && models.length > 0 ? (
        <Flex direction="column">
          {models.map((model) => (
            <Box key={model._id}>
              <Flex
                justify="space-between"
                align="center"
                bg="white"
                p={2}
                borderRadius="md"
                mb={2}
              >
                <Flex align="center" gap={2}>
                  <IconButton
                    aria-label="Toggle types"
                    icon={expandedModel === model._id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleTypes(model._id)}
                  />
                  <Text>{model.name}</Text>
                </Flex>
                <HStack>
                  <IconButton
                    aria-label="Editar modelo"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => onEditModel(model)}
                  />
                  <IconButton
                    aria-label="Eliminar modelo"
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDeleteModel(model)}
                  />
                </HStack>
              </Flex>
              {expandedModel === model._id && (
                <ModelTypeList
                  modelId={model._id}
                  types={modelTypes}
                  isLoading={isLoadingTypes}
                  onAddType={handleAddType}
                  onEditType={handleEditType}
                  onDeleteType={handleDeleteType}
                />
              )}
            </Box>
          ))}
        </Flex>
      ) : (
        <Text color="gray.500">No hay modelos disponibles</Text>
      )}

      <ModelTypeFormModal
        isOpen={isAddTypeOpen}
        onClose={onAddTypeClose}
        formData={modelTypeFormData}
        setFormData={setModelTypeFormData}
        onSubmit={handleCreateType}
        isLoading={createMutation.isPending}
      />

      <ModelTypeFormModal
        isOpen={isEditTypeOpen}
        onClose={onEditTypeClose}
        formData={modelTypeFormData}
        setFormData={setModelTypeFormData}
        onSubmit={handleUpdateType}
        isEdit
        isLoading={updateMutation.isPending}
      />

      <AlertDialog
        isOpen={isDeleteTypeOpen}
        onClose={onDeleteTypeClose}
        title="Eliminar Tipo"
        body="¿Está seguro que desea eliminar este tipo? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        onConfirm={handleConfirmDeleteType}
      />
    </Box>
  )
}
