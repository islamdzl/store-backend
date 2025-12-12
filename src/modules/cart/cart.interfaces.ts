import type Joi from "joi";


declare global {
  interface Cart {
    ownerId: ID;
    product: ID;
    count: number;
  }
  
  namespace Cart {
    interface AddItem extends Omit<Cart, 'ownerId'> {
      productId?: ID;
    }

    interface Encrement {
      cartItemId: ID
    }
    interface Decrement {
      cartItemId: ID
    }
    interface RemoveItem {
      productId: string;
      cartItemId: string;
    }



    namespace Request {
      namespace Bye {
        interface Product {
          productId: ID;
          count: number;
          types?: Product.Request.Buy.Type[]
          color?: string;
        }
      }
      interface ByeAll {
        buyingDetails: User.BuyingDetails;
        products: Cart.Request.Bye.Product[];
      }
    }
  }
}
