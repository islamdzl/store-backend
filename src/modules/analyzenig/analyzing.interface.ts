

declare global {
  interface Analyzing {
    date: Analyzing.Date;
    data: Analyzing.SellData[] | Analyzing.ProfitData[]
  }
  namespace Analyzing {
    enum Date {
      MONTH = 'MONTH',
      YEAR = 'YEAR',
      DAY = 'DAY',
    }
    interface Info {
      name: string;
      value: string | number;
    }
    interface SellData {
      products: Analyzing.SellData.Products[];
      count: number;
    }
    interface ProfitData {
      deliveryPrice: number;
      productsPrice: number;
      totalPrice: number;
      dateTime: number;
    }

    namespace SellData {
      interface Products {
        productId: ID;
        count: number;
        dateTime: number;
      }
    }
    namespace Request {
      interface SellData {
        date: Analyzing.Date
        productId?: ID;
        skip: number;
      }
      interface ProfitData {
        date: Analyzing.Date,
        productId?: ID;
        skip: number;
      }

    }

    namespace Response {
      interface SellData {
        type: string;
        date: Analyzing.Date;
        allProducts: number;
        skip: number;
        data: Analyzing.SellData[]
        info: Analyzing.Info[];
      }
      interface ProfitData {
        type: string;
        date: Analyzing.Date;
        skip: number;
        totalPrice: number;
        data: Analyzing.ProfitData[];
        info: Analyzing.Info[];
      }
      interface Genral {

      }
    }
  }
}