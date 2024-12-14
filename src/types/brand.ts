export interface Brand {
  _id: string
  name: string
  image: string
}

export interface BrandModel {
  _id: string
  brandId: string
  name: string
}

export interface ModelType {
  _id: string
  modelId: string
  name: string
}

export interface CreateBrandDto {
  name: string
  image: string
}

export interface CreateBrandModelDto {
  brandId: string
  name: string
}

export interface CreateModelTypeDto {
  modelId: string
  name: string
}

export interface UpdateBrandDto {
  name?: string
  image?: string
}

export interface UpdateBrandModelDto {
  name?: string
  brandId?: string
}

export interface UpdateModelTypeDto {
  name?: string
  modelId?: string
}
