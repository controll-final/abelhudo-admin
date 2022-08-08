import React, { Fragment, useEffect, useState } from 'react'
import { useLazyQuery } from 'react-apollo'
import { Spinner, EmptyState } from 'vtex.styleguide'
import useProductCombinations from '../hooks/useProductCombination'
import { ProductType, CombinationType } from '../typings/types'
import Suggestion from './Suggestion'
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
      <div className="flex flex-column items-center">
        {loadingCombinations || loadingProductsById ? (
          <Spinner />
        ) : (
          <Fragment>
            <div className="flex items-center justify-between w-100 bb fw3 b--black-05 pb2 mt2">
              <strong>Combinações Disponíveis</strong>
              <strong>Ativar/Desativar</strong>
            </div>
            {combinations.length > 0 ? (
              combinations.map((suggestion) => (
                <Suggestion
                  key={suggestion.id}
                  suggestion={suggestion}
                  productId={product.id}
                />
              ))
            ) : (
              <EmptyState title="Nenhuma sugestão disponível">
                <p>
                  Não encontramos nenhuma sugestão para o produto selecionado.
                </p>
              </EmptyState>
            )}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default ProductData
