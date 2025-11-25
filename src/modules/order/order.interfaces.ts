
declare global {
  interface Order {
    product: ID;
    userId?: ID;
    count: number;
    message?: string;
    totalPrice: number;
    status: Order.Status;
    color?: string; 
    types: Order.Type[]; 
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