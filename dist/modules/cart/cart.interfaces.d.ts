declare global {
    interface Cart {
        ownerId: ID;
        product: ID;
        count: number;
    }
    namespace Cart {
        interface AddItem extends Omit<Cart, 'ownerId'> {
            productId?: ID;
        }
        interface Encrement {
            cartItemId: ID;
        }
        interface Decrement {
            cartItemId: ID;
        }
        interface RemoveItem {
            productId: string;
            cartItemId: string;
        }
    }
}
export {};
//# sourceMappingURL=cart.interfaces.d.ts.map