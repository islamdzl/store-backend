import type Joi from "joi";


declare global {
  interface Cart {
    ownerId: ID;
    productId: ID;
    count: number;
  }
  
  namespace Cart {
    interface RequestAddItem extends Omit<Cart, 'ownerId'> {}
    interface RequestRemoveItem {
      productId: string;
    }
  }
}
