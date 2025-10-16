import type { Types } from "mongoose";

declare global {
  interface Product {
    _id: Types.ObjectId;
    name: string;
    price: number;
    promo: number;
    description: string;
    images: string[];
    isActive: boolean;
    contity: number;
    requests: number;
    __v: number;
  }

  namespace Product {

    interface Create extends Omit<Product, '_id' | '__v' | 'promo'> {}
    interface Update extends Omit<Product, '_id' | '__v' | 'images' | 'requests'> {
      productId: ID;
      RImages: string[];
      AImages: string[];
    }

    interface Buy {
      productId: string;
      count: number;
      buyingDetails?: User.BuyingDetails;
    }

  }
}