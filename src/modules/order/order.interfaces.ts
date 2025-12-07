
declare global {
  interface Order {
    product: ID;
    userId?: ID;
    count: number;
    productPrice: number;
    color?: string; 
    types: Order.Type[]; 
    promo: number;
    deliveryPrice: number;
    message?: string;
    status: Order.Status;
    buyingDetails: User.BuyingDetails;
    createdAt: Date;
    updatedAt: Date;
  }

  namespace Order {
    enum Status {
      PENDING   = 'PENDING',
      ACCEPTED  = 'ACCEPTED',
      REJECTED  = 'REJECTED',
      FULFILLED = 'FULFILLED'
    }
    interface Type {
      key: string;
      val: string;
    }

    interface Create extends Omit<Order, 'createdAt' | 'updatedAt'> {}

    namespace Request {
      interface Create extends Omit<Order, 'createdAt' | 'updatedAt'> {}
      
      interface AcceptMany {
        orderId: ID;
        message?: string;
        trackingCode?: string;
      }
      
      interface RejectMany {
        message?: string;
        ordersIds: ID[]
      }
    }
  }
}