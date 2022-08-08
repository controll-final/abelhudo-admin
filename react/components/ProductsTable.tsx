import React, { Fragment, useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import { ProductContext } from '../context/productContext';
import { getAllProducts, getToken } from '../services/api';
import { AuthType, ProductContextType, ProductType } from '../typings/types';
import { Button, Table, Modal, InputSearch, Spinner } from 'vtex.styleguide'
import ProductData from './ProductData';

const ProductsTable: React.FC = () => {
  const { token, updateToken } = useContext(AuthContext) as AuthType
  const { products, updateProducts } = useContext(ProductContext) as ProductContextType
  const [mainProduct, setMainProduct] = useState<ProductType>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getAuth = async () => {
    const response = await getToken()
    console.log("Auth Response: ", response)
    updateToken(response.access_token)
  }

  const getProducts = async () => {
    if (!token) return
    const { content } = await getAllProducts(token, search)
    console.log("PRoducts: ", content)
    updateProducts(content)
  }

  useEffect(() => {
    console.log("Buscando autenticação")
    getAuth()
  }, [])

  useEffect(() => {
    getProducts()
  }, [token])

  useEffect(() => {
    if (products.length > 0) setIsLoading(false)
  }, [products])

  const toggleModal = async (rowData: ProductType) => {
    const itemInfo = await fetch(
      `/api/catalog_system/pub/products/variations/${rowData.id}`
    )

    const { skus } = await itemInfo.json()

    console.log("SKUS: ", skus)

    setMainProduct({
      ...rowData,
      image: skus[0].image,
      price: skus[0].bestPriceFormated,
    })
    setIsModalOpen(!isModalOpen)
  }

  function updateSearch(e: any) {
    setSearch(e.target.value);
    getProducts();
  }

  const defaultSchema = {
    properties: {
      id: {
        title: 'ID',
        width: 50,
      },
      name: {
        title: 'Produto',
        minWidth: 400,
        sortable: true,
      },
      quantitySold: {
        title: 'Vendas',
        width: 100,
        sortable: true,
      },
      totalCombinations: {
        title: 'Qtd. Combinações',
        width: 150,
        sortable: true,
      },
      action: {
        title: 'Ações',
        cellRenderer: (rowData: { rowData: ProductType }) => {
          console.log("RowDAta: ", rowData.rowData)
          return (
            <Button
              onClick={() => {
                toggleModal({ ...rowData.rowData })
              }}
            >
              Combinações
            </Button>
          )
        },
      },
    },
  }

  return (
    <Fragment>
      <InputSearch
        placeholder="Busque seu produto aqui..."
        value={search}
        size="regular"
        onChange={(e: any) => {
          updateSearch(e)
        }}
        onSubmit={(e: any) => {
          e.preventDefaul()
          updateSearch(e)
        }}
      />
      {isLoading ?
        (
          <div className="flex justify-center pa7">
            <Spinner />
          </div>
        ) :
        (
          <Table
            fixFirstColumn
            fullWidth
            schema={defaultSchema}
            items={products}
          />
        )
      }

      {mainProduct && (
        <Modal
          centered
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
          }}
        >
          <ProductData product={mainProduct} />
        </Modal>
      )}
    </Fragment>
  )
}

export default ProductsTable;