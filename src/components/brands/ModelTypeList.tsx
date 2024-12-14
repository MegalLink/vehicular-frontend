import {
  Box,
  Button,
  Flex,
  Text,
  IconButton,
  HStack,
  Spinner,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { ModelType } from '../../types/brand'

interface ModelTypeListProps {
  modelId: string
  types: ModelType[] | undefined
  isLoading: boolean
  onAddType: (modelId: string) => void
  onEditType: (type: ModelType) => void
  onDeleteType: (type: ModelType) => void
}

export default function ModelTypeList({
  modelId,
  types,
  isLoading,
  onAddType,
  onEditType,
  onDeleteType,
}: ModelTypeListProps) {
  return (
    <Box pl={4} mt={2}>
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" color="gray.600">
          Tipos
        </Text>
        <Button
          size="xs"
          leftIcon={<AddIcon />}
          colorScheme="blue"
          variant="ghost"
          onClick={() => onAddType(modelId)}
        >
          Nuevo Tipo
        </Button>
      </Flex>

      {isLoading ? (
        <Flex justify="center" py={2}>
          <Spinner size="sm" />
        </Flex>
      ) : types && types.length > 0 ? (
        <Flex direction="column" gap={1}>
          {types.map((type) => (
            <Flex
              key={type._id}
              justify="space-between"
              align="center"
              bg="gray.50"
              p={1}
              borderRadius="md"
              fontSize="sm"
            >
              <Text>{type.name}</Text>
              <HStack spacing={1}>
                <IconButton
                  aria-label="Editar tipo"
                  icon={<EditIcon />}
                  size="xs"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => onEditType(type)}
                />
                <IconButton
                  aria-label="Eliminar tipo"
                  icon={<DeleteIcon />}
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={() => onDeleteType(type)}
                />
              </HStack>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Text fontSize="sm" color="gray.500">
          No hay tipos disponibles
        </Text>
      )}
    </Box>
  )
}
