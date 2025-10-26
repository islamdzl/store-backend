

declare global {
  interface Search {
    keyWord: string;
    userId: ID;
    createdAt: Date;
    updatedAt: Date;
  }
  namespace Search {
    interface FindProductsFilter {
      skip: number;
      limit: number;
      sort: Search.Sort;
      classification?: {
        category: string;
        branch?: string;
      };
    }

    interface Explore extends FindProductsFilter {
      keyWord: string;
    }

    interface ProductResponse extends Omit<Product, 'isActive' | '__v'> {
      inCart: boolean;
    }
    
    enum Sort {
      HOT = 'HOT',
      NEW = 'NEW',
      BUY = 'BUY',
    }
  }
}