import { useCallback, useState } from "react";
import { Product } from "../service/@types";
import ProductService from './../service/services/Product.service';

export default function useProducts() {
  const [loading, setLoading] = useState(false);
  const [productsPage, setProductsPage] = useState<Product.Paginated>();

  const fetchProductsPage = useCallback(async function (search: Product.Query) {
    setLoading(true);
    await ProductService.getAllProducts(search)
      .then(setProductsPage)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    fetchProductsPage,
    loading,
    productsPage,
  };
}
