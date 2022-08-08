import React, { createContext, useState } from 'react'
import { ProductContextType, ProductType } from '../typings/types'

export const ProductContext = createContext<ProductContextType | null>(null)

export const ProductStorage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductType[]>([])

  const updateProducts = (products: ProductType[]) => {
    setProducts(products)
  }

  return (
    <ProductContext.Provider value={{ products, updateProducts }}>
      {children}
    </ProductContext.Provider>
  )
}
