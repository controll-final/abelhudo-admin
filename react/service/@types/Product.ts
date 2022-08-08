export namespace Product {
  export type Paginated = {
    content: Detailed[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  }

  export type Detailed = {
    id: number;
    name: string;
    active: boolean;
    quantitySold: number;
    totalCombinations: number;
  }

  export type Query = {
    name?: string;
    page?: number;
    size?: number;
    sort?: [keyof Detailed, "asc" | "desc"];
  };
}
