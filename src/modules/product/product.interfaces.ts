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
    classification: Product.Classification;
    requests: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  namespace Product {

    interface Classification {
      category: ID;
      branch: ID;
    }

    interface Create extends Omit<Product, 
    '_id' | '__v' | 'promo' | 'updatedAt' | 'createdAt'
    > {
      branchId?: ID;
    }
    interface Update extends Omit<Product, 
    '_id' | '__v' | 'images' | 'requests' | 'updatedAt' | 'createdAt'
    > {
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