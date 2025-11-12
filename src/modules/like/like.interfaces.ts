

declare global {
  interface Like {
    _id: ID;
    userId: ID;
    product: ID;
    createdAt: Date;
    updatedAt: Date;
  }

  namespace Like {
    interface Create {
      productId: string;
    }
    interface Remove {
      productId: string;
      likeItemId: string;
    }
  }
}