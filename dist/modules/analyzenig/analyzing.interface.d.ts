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
            productId: ID;
            count: number;
        }
        interface ProfitData {
            deliveryPrice: number;
            productsPrice: number;
            totalPrice: number;
        }
        namespace Request {
            interface SellData {
                date: Analyzing.Date;
                productId?: ID;
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
        }
    }
}
export {};
//# sourceMappingURL=analyzing.interface.d.ts.map