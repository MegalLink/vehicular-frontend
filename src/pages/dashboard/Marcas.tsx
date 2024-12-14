import {  Container, useDisclosure, useToast } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { brandService } from '../../services/brand'
import { QUERY_KEYS } from '../../constants/query_keys'
import { Brand, BrandModel, CreateBrandModelDto,CreateBrandDto } from '../../types/brand'
import BrandFormModal from '../../components/brands/BrandFormModal'
import BrandModelFormModal from '../../components/brands/BrandModelFormModal'
import BrandList from '../../components/brands/BrandList'
import { useState } from 'react'
import { ConfirmationDialog } from '../../components/common/ConfirmationDialog'
import { useBrandMutations } from '../../hooks/useBrandMutations'
import { useBrandModelMutations } from '../../hooks/useBrandModelMutations'

export default function Marcas() {
  const toast = useToast()

  // Modals
  const {
    isOpen: isBrandFormOpen,
    onOpen: onBrandFormOpen,
    onClose: onBrandFormClose,
  } = useDisclosure()

  const {
    isOpen: isBrandDeleteOpen,
    onOpen: onBrandDeleteOpen,
    onClose: onBrandDeleteClose,
  } = useDisclosure()

  const {
    isOpen: isModelFormOpen,
    onOpen: onModelFormOpen,
    onClose: onModelFormClose,
  } = useDisclosure()

  const {
    isOpen: isModelDeleteOpen,
    onOpen: onModelDeleteOpen,
    onClose: onModelDeleteClose,
  } = useDisclosure()

  // State
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [selectedBrandModel, setSelectedBrandModel] = useState<BrandModel | null>(null)
  const [brandFormData, setBrandFormData] = useState<CreateBrandDto>({
    name: '',
    image: ''
  })
  const [modelFormData, setModelFormData] = useState<CreateBrandModelDto>({
    name: '',
    brandId: ''
  })

  // Queries
  const { data: brands, isLoading: isBrandsLoading } = useQuery({
    queryKey: [QUERY_KEYS.BRANDS],
    queryFn: brandService.getAllBrands,
  })

  // Mutations
  const { createMutation, updateMutation, deleteMutation } = useBrandMutations()
  const { createMutation: createModelMutation, updateMutation: updateModelMutation, deleteMutation: deleteModelMutation } = useBrandModelMutations(selectedBrand?._id || null)

  // Brand handlers
  const handleAddBrand = () => {
    setSelectedBrand(null)
    setBrandFormData({ name: '', image: '' })
    onBrandFormOpen()
  }

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    setBrandFormData({
      name: brand.name,
      image: brand.image || ''
    })
    onBrandFormOpen()
  }

  const handleDeleteBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    onBrandDeleteOpen()
  }

  const handleBrandFormSubmit = async () => {
    try {
      if (selectedBrand) {
        await updateMutation.mutateAsync({
          id: selectedBrand._id,
          data: brandFormData
        })
      } else {
        await createMutation.mutateAsync(brandFormData)
      }
      onBrandFormClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: selectedBrand
          ? 'No se pudo actualizar la marca'
          : 'No se pudo crear la marca',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleConfirmDeleteBrand = async () => {
    if (!selectedBrand) return

    try {
      await deleteMutation.mutateAsync(selectedBrand._id)
      toast({
        title: 'Marca eliminada',
        description: 'La marca ha sido eliminada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onBrandDeleteClose()
    } catch (_) {
      
    }
  }

  // Model handlers
  const handleAddModel = (brandId: string) => {
    setSelectedBrand({ _id: brandId } as Brand)
    setSelectedBrandModel(null)
    setModelFormData({ name: '', brandId: brandId }) // Initialize with brandId
    onModelFormOpen()
  }

  const handleEditModel = (model: BrandModel, brandId: string) => {
    setSelectedBrand({ _id: brandId } as Brand)
    setSelectedBrandModel(model)
    setModelFormData({ name: model.name, brandId: brandId }) // Initialize with existing data
    onModelFormOpen()
  }

  const handleDeleteModel = (model: BrandModel, brandId: string) => {
    setSelectedBrand({ _id: brandId } as Brand)
    setSelectedBrandModel(model)
    onModelDeleteOpen()
  }

  const handleModelFormSubmit = async (data: any) => {
    if (!selectedBrand) return

    try {
      if (selectedBrandModel) {
        await updateModelMutation.mutateAsync({
          id: selectedBrandModel._id,
          data: { name: modelFormData.name },
        })
        toast({
          title: 'Modelo actualizado',
          description: 'El modelo ha sido actualizado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        await createModelMutation.mutateAsync({
          brandId: selectedBrand._id,
          name: modelFormData.name,
        })
        toast({
          title: 'Modelo creado',
          description: 'El modelo ha sido creado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }
      onModelFormClose()
      setModelFormData({ name: '', brandId: '' }) // Reset form data
    } catch (error) {
      toast({
        title: 'Error',
        description: selectedBrandModel
          ? 'No se pudo actualizar el modelo'
          : 'No se pudo crear el modelo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleModelFormSubmitWrapper = async () => {
    await handleModelFormSubmit(modelFormData);
  }

  const handleConfirmDeleteModel = async () => {
    if (!selectedBrand || !selectedBrandModel) return

    try {
      await deleteModelMutation.mutateAsync(selectedBrandModel._id)
      toast({
        title: 'Modelo eliminado',
        description: 'El modelo ha sido eliminado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onModelDeleteClose()
    } catch (_) {
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Brand List */}
      <BrandList
        brands={brands}
        isLoading={isBrandsLoading}
        onAddBrand={handleAddBrand}
        onEditBrand={handleEditBrand}
        onDeleteBrand={handleDeleteBrand}
        onAddModel={handleAddModel}
        onEditModel={handleEditModel}
        onDeleteModel={handleDeleteModel}
      />

      {/* Brand Form Modal */}
      <BrandFormModal
        isOpen={isBrandFormOpen}
        onClose={onBrandFormClose}
        onSubmit={handleBrandFormSubmit}
        formData={brandFormData}
        setFormData={setBrandFormData}
        isEdit={!!selectedBrand}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Model Form Modal */}
      <BrandModelFormModal
        isOpen={isModelFormOpen}
        onClose={onModelFormClose}
        onSubmit={handleModelFormSubmitWrapper}
        model={selectedBrandModel}
        formData={modelFormData}
        setFormData={setModelFormData}
        isLoading={createModelMutation.isPending || updateModelMutation.isPending}
      />

      {/* Brand Delete Dialog */}
      <ConfirmationDialog
        isOpen={isBrandDeleteOpen}
        onClose={onBrandDeleteClose}
        onConfirm={handleConfirmDeleteBrand}
        title="Eliminar Marca"
        description={`¿Estás seguro de que deseas eliminar la marca ${selectedBrand?.name}?`}
      />

      {/* Model Delete Dialog */}
      <ConfirmationDialog
        isOpen={isModelDeleteOpen}
        onClose={onModelDeleteClose}
        onConfirm={handleConfirmDeleteModel}
        title="Eliminar Modelo"
        description={`¿Estás seguro de que deseas eliminar el modelo ${selectedBrandModel?.name}?`}
      />
    </Container>
  )
}
