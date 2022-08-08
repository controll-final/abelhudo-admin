export namespace ProductCombination {
  export type Paginated = {
    content: Detailed[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }

  export type Detailed = {
    productId: number;
    productName: string;
    productQuantitySold: number;
    combinedProductId: number;
    combinedProductName: string;
    combinedProductQuantitySold: number;
    combinationCount: number;
    combinationActive: boolean;
  }
}
