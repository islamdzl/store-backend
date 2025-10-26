

declare global {
  interface Like {
    _id: ID;
    userId: ID;
    productId: ID;
    preview: string;
    createdAt: Date;
    updatedAt: Date;
  }

  namespace Like {
    interface Create {
      productId: ID;
    }
    interface Remove {
      productId: ID;
    }
  }
}