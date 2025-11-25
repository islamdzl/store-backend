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
    types: Product.Type[];
    colors: string[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  }

  namespace Product {

    interface Classification {
      category: ID;
      branch?: ID | null;
    }
    interface KeyVal {
      key: string;
      val: string;
    }
    interface Type {
      typeName: string;
      values: string[];
    }
    interface Create extends Omit<Product, '_id' | '__v' | 'updatedAt' | 'createdAt'> {}


    namespace Request {

      namespace Buy {
        interface Type {
          typeName: string;
          selectedIndex: number;
        }
      }

      namespace Create {
        interface Type {
          typeName: string;
          values: string[];
        }
        interface KeyVal {
          key: string;
          val: string;
        }
      }

      namespace Update {
        interface Image {
          type: 'old' | 'new';
          url: string;
          _id: string;
        }
      }

      interface Buy {
        productId: string;
        count: number;
        color?: string;
        buyingDetails?: User.BuyingDetails;
        types: Product.Request.Buy.Type[]
      }

  
      interface Create extends Omit<Product, '_id' | '__v' | 'promo' | 'updatedAt' | 'createdAt'> {
        classification: Product.Classification;
      }

      interface Update extends Omit<Product, '_id' | '__v' | 'images' | 'requests' | 'updatedAt' | 'createdAt' | 'promo'> {
        promo?: number;
        productId: ID;
        images: Product.Request.Update.Image[];
      }
    }

  }
}