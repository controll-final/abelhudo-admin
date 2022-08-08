import React, { Fragment, useEffect, useState } from 'react'
import { ProductType } from '../typings/types';
import { Button, Table, Modal, InputSearch } from 'vtex.styleguide'
import ProductData from './ProductData';
import useProducts from './../hooks/useProducts';

const ProductsTable: React.FC = () => {
  const { productsPage, loading, fetchProductsPage } = useProducts();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(pageSize);

  useEffect(() => {
    fetchProductsPage({
      name: search,
      page,
      size: pageSize,
      sort: ["quantitySold", "desc"],
    });
    console.log('useEffect');
  }, [fetchProductsPage, search, page, pageSize]);


  function handleNextClick() {
    const newPage = page + 1;
    const itemFrom = ((page + 1) * pageSize) + 1;
    const itemTo = ((page + 1) * pageSize) + pageSize;
    goToPage(newPage, itemFrom, itemTo)
  }

  function handlePreviousClick() {
    const newPage = page - 1;
    const itemFrom = ((page - 1) * pageSize) + 1;
    const itemTo = ((page - 1) * pageSize) + pageSize;
    goToPage(newPage, itemFrom, itemTo)
  }

  function goToPage(newPage: number, itemFrom: number, itemTo: number) {
    setPage(newPage);
    setCurrentItemFrom(itemFrom);
    setCurrentItemTo(itemTo);
  }

  //const { token, updateToken } = useContext(AuthContext) as AuthType
  //onst { products, updateProducts } = useContext(ProductContext) as ProductContextType
  const [mainProduct, setMainProduct] = useState<ProductType>()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

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
    setPage(0);
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
          //console.log("RowDAta: ", rowData.rowData)
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

      <Table
        fixFirstColumn
        fullWidth
        schema={defaultSchema}
        items={productsPage?.content}
        loading={loading}
        pagination={{
          onNextClick: () => handleNextClick(),
          onPrevClick: () => handlePreviousClick(),
          currentItemFrom: currentItemFrom,
          currentItemTo: currentItemTo,
          totalItems: productsPage?.totalElements,
        }}
      />


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
