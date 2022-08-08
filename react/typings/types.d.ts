
export type ProductContextType = {
  products: ProductType[]
  updateProducts: (products: ProductType[]) => void
}

export type PaginationType = {
  number?: number
  size?: number
  totalElements?: number
  totalPages?: number

  updatePagination: (page: number, totalPages: number, size: number) => void
}

export type AuthType = {
  token: string | undefined
  updateToken: (data: string) => void
}

export type ProductType = {
  id: number
  name: string
  active: boolean
  quantitySold: number
  totalCombinations: number
  image?: string
  price?: string
}

export type SuggestionType = {
  id: number
  name: string
  image?: string
  isActive?: boolean
  combinationCount: number
}
