import { useCallback, useState } from "react";
import { ProductCombination } from "../service/@types/ProductCombination";
import ProductService from '../service/services/Product.service';

export default function useProductCombinations() {
  const [loadingCombinations, setLoadingCombinations] = useState(false);
  const [productCombinationsPage, setProductCombinationsPage] = useState<ProductCombination.Paginated>();

  const fetchProductCombinationsByProductId = useCallback(async function (productId: number) {
    setLoadingCombinations(true);
    await ProductService.getAllCombinationsByProductId(productId)
      .then(setProductCombinationsPage)
      .finally(() => {
        setLoadingCombinations(false);
      });
  }, []);

  return {
    fetchProductCombinationsByProductId,
    loadingCombinations,
    productCombinationsPage,
  };
}
