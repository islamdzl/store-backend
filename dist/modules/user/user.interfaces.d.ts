import type { Types } from "mongoose";
interface buyingDetails {
    fullName: string;
    phone1: string;
    phone2: string;
    state: number;
    city: string;
    postalCode: string;
    note: string;
    deliveryToHome: boolean;
}
declare global {
    interface User {
        _id: Types.ObjectId;
        username: string;
        email: string;
        picture: string;
        password: string;
        buyingDetails: buyingDetails;
        __v: number;
    }
    namespace User {
        interface BuyingDetails extends buyingDetails {
        }
        interface Register {
            email: string;
            username: string;
            password: string;
        }
        interface Login {
            email: string;
            password: string;
        }
        interface Update {
            buyingDetails: User.BuyingDetails;
        }
        interface LoginResponse {
            token: string;
            username: string;
            picture: string;
            isAdmin: boolean;
            email: string;
        }
    }
}
export {};
//# sourceMappingURL=user.interfaces.d.ts.map