import type Joi from "joi";


declare global {
  interface Cart {
    ownerId: ID;
    productId: ID;
    count: number;
  }
  
  namespace Cart {
    interface AddItem extends Omit<Cart, 'ownerId'> {}
    interface Encrement {
      cartItemId: ID
    }
    interface Decrement {
      cartItemId: ID
    }
    interface RemoveItem {
      productId: string;
    }
  }
}
