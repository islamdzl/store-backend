declare global {
    interface Analyzing {
        date: Analyzing.Date;
        data: Analyzing.SellData[] | Analyzing.ProfitData[];
    }
    namespace Analyzing {
        enum Date {
            MONTH = "MONTH",
            YEAR = "YEAR",
            DAY = "DAY"
        }
        interface SellData {
            products: Analyzing.SellData.Products[];
            count: number;
        }
        interface ProfitData {
            deliveryPrice: number;
            productsPrice: number;
            totalPrice: number;
        }
        namespace SellData {
            interface Products {
                productId: ID;
                count: number;
            }
        }
        namespace Request {
            interface SellData {
                productId?: ID;
                date: Analyzing.Date;
                skip: number;
            }
            interface ProfitData {
                date: Analyzing.Date;
                productId?: ID;
                skip: number;
            }
        }
        namespace Response {
            interface SellData {
                date: Analyzing.Date;
                allProducts: number;
                skip: number;
                data: Analyzing.SellData[];
            }
            interface ProfitData {
                date: Analyzing.Date;
                skip: number;
                data: Analyzing.ProfitData[];
            }
            interface Genral {
            }
        }
    }
}
export {};
//# sourceMappingURL=analyzing.interface.d.ts.map