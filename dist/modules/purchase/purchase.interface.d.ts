declare global {
    interface Purchase {
        productId: ID;
        deliveryPrice: number;
        productPrice: number;
        count: number;
        client?: ID;
        createdAt: Date;
        updatedAt: Date;
    }
    namespace Purchase {
        interface Create {
            productId: ID;
            deliveryPrice: number;
            productPrice: number;
            count: number;
            client?: ID;
        }
    }
}
export {};
//# sourceMappingURL=purchase.interface.d.ts.map