import React, { useEffect, useState } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Spinner, Table, Toggle } from 'vtex.styleguide'
import useProductCombinations from '../hooks/useProductCombination'
import { ProductType, CombinationType } from '../typings/types'
import productsByIdentifier from "../graphql/productsByIdentifier.graphql";

enum ProductUniqueIdentifierField {
  id = "id",
  slug = "slug",
  ean = "ean",
  reference = "reference",
  sku = "sku",
}

type Props = {
  product: ProductType
}

const ProductData: React.FC<Props> = ({ product }) => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [currentItemFrom, setCurrentItemFrom] = useState(1);
  const [currentItemTo, setCurrentItemTo] = useState(pageSize);
  const [combinations, setCombinations] = useState<CombinationType[]>([]);

  const {
    productCombinationsPage,
    loadingCombinations,
    fetchProductCombinationsByProductId,
  } = useProductCombinations();

  const [
    queryProductsById,
    { data: products, loading: loadingProductsById, called: productsByIdCalled },
  ] = useLazyQuery(productsByIdentifier, { notifyOnNetworkStatusChange: true });

  useEffect(() => {
    fetchProductCombinationsByProductId(product.id);
  }, [product]);

  useEffect(() => {
    if (!productCombinationsPage) {
      return;
    }

    const productCombinedIds = productCombinationsPage.content.map(
      (productCombination) => productCombination.combinedProductId
    );

    if (productCombinedIds.length === 0) {
      return;
    }

    const executeQuery = (variables: Record<string, any>) =>
      queryProductsById({
        variables,
      });

    executeQuery({
      field: ProductUniqueIdentifierField.id,
      values: productCombinedIds,
    });
  }, [productCombinationsPage]);

  function isActive(productId: number): boolean {
    const result = productCombinationsPage?.content.filter((product) => {
      return product.combinedProductId == productId;
    });

    if (result && result.length > 0) {
      return result[0].combinationActive;
    }

    return false;
  }

  useEffect(() => {
    if (productsByIdCalled) {
      products.productsByIdentifier.map((item: any) => {
        const combination: CombinationType = {
          id: item.productId,
          name: item.productName,
          image: item.items[0].images[0].imageUrl,
          isActive: isActive(item.productId),
        }

        setCombinations((prevCombinations) => [...prevCombinations, combination])
      })
    }
  }, [products])

  const toggleSuggestion = () => {

  }

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

  const defaultSchema = {
    properties: {
      id: {
        title: 'ID',
        width: 50,
      },
      image: {
        title: 'Imagem',
        width: 100,
        cellRenderer: ({ rowData }: any) => {
          console.log("rowData: ", rowData)
          return (
            <img src={rowData.image} alt={rowData.name} className="db h-100" />
          )
        }
      },
      name: {
        title: 'Produto',
        minWidth: 300,
        sortable: true,
      },
      combinationCount: {
        title: 'Vendas',
        width: 90,
        sortable: true,
      },
      action: {
        title: 'Ações',
        width: 100,
        cellRenderer: () => {
          return (
            <Toggle
              onChange={() => {
                toggleSuggestion()
              }}
              checked={isActive}
            />
          )
        },
      },
    },
  }

  return (
    <div className="flex flex-column justify-center">
      <div className="flex items-center justify-start">
        <div className="w-25">
          <img src={product.image} alt={product.name} className="w100" />
        </div>
        <div className="flex flex-column items-start justify-start pv4">
          <div className="pa2">
            <span className="db fw1 pv4">Nome do Produto:</span>
            <span className="db fw5">{product.name}</span>
          </div>
          <div className="pa2">
            <span className="db fw1 pv4">Unidades Vendidas:</span>
            <strong className="db fw5">{product.quantitySold}</strong>
          </div>
        </div>
      </div>
      <div className="db">
        {loadingCombinations || loadingProductsById ? (
          <Spinner />
        ) : (
          <Table
            className="w-100 pa0"
            fullWidth
            density="low"
            dynamicRowHeight
            schema={defaultSchema}
            items={combinations}
            pagination={{
              onNextClick: () => handleNextClick(),
              onPrevClick: () => handlePreviousClick(),
              currentItemFrom: currentItemFrom,
              currentItemTo: currentItemTo,
              totalItems: combinations?.length,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default ProductData
