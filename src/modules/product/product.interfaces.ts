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
    classification: Product.Classification;
    requests: number;
    quantity: number | null;
    delivery: number | null;
    keyVal: Product.KeyVal[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  namespace Product {

    interface Classification {
      category: ID;
      branch: ID | null;
    }
    interface KeyVal {
      key: string;
      val: string;
    }
    interface Image {
      type: 'old' | 'new';
      url: string;
      _id: string;
    }

    interface Create extends Omit<Product, 
    '_id' | '__v' | 'promo' | 'updatedAt' | 'createdAt'
    > {
      classification: Product.Classification;
    }
    interface Update extends Omit<Product, 
    '_id' | '__v' | 'images' | 'requests' | 'updatedAt' | 'createdAt'
    > {
      productId: ID;
      images: Product.Image[];
    }

    interface Buy {
      productId: string;
      count: number;
      buyingDetails?: User.BuyingDetails;
    }

  }
}