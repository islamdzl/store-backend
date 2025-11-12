
declare global {
  interface Order {
    product: ID;
    userId?: ID;
    count: number;
    totalPrice: number;
    status: Order.Status;
    message?: string;
    trackingCode?: string;
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

    interface AcceptMany {
      orderId: ID;
      message?: string;
      trackingCode?: string;
    }
    
    interface RejectMany {
      message?: string;
      ordersIds: ID[]
    }

    interface Create extends Omit<Order, 'createdAt' | 'updatedAt'> {}
  }
}