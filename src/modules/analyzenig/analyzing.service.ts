import * as PurchaseService from '../purchase/purchase.service.js'


const getTime: (date: 'DAY' | 'MONTH' | 'YEAR')=> {Time: number, Loops: number, timeName: string} = (date)=> {
  const DAY = 1000 * 60 * 60 * 24;
  let Loops = 0;
  let Time = 0;
  let timeName = '';

  switch (date) {
    case 'MONTH': 
    Time = DAY; 
    Loops = 30;
    timeName = 'Day';
    break;
    case 'YEAR': 
    Time = DAY * 30; 
    Loops = 12;
    timeName = 'Month';
    break;
    case 'DAY': 
    Time = 1000 * 60 * 60; 
    Loops = 24;
    timeName = 'Houre';
    break;
  }
  return { Time, Loops, timeName }
}

export const getSellData: (data: Analyzing.Request.SellData)=> Promise<Analyzing.Response.SellData> = async(data)=> {
  const { Time, Loops, timeName } = getTime(data.date);

  const ET = new Date(Date.now())
  const ST = new Date(ET.getTime() - (Time * Loops))
    
  const purchases = await PurchaseService.getByDate(ST, ET,
    data.productId
  )

  let sell: Analyzing.SellData[] = []
  while (sell.length < Loops) sell.push({
    count: 0,
    products: [],
  })
  
  
  purchases.forEach((p)=> {
    const date = new Date(p.createdAt).getTime();
    const index = Math.floor((date - ST.getTime()) / Time);

    if (index >= 0 && index < Loops) {
      sell[index]!.count += p.count;
      sell[index]!.products.push({
        count: p.count,
        productId: p.productId,
        dateTime: new Date(p.createdAt).getTime()
      });
    }
  })

  const reversedList = [...sell].reverse();

  const result: Analyzing.Response.SellData = {
    type: 'SELL',
    data: sell,
    allProducts: purchases.reduce((value, p)=> value += p.count, 0),
    skip: data.skip,
    date: data.date,
    info: [
      {name: `Last ${timeName} Orders`, value: reversedList[0]?.count || 0},
      {name: `Last 3 ${timeName}s Orders`, value: reversedList.slice(0, 3).reduce((value, item)=> value += item.count, 0)},
      {name: `Last 6 ${timeName}s Orders`, value: reversedList.slice(0, 6).reduce((value, item)=> value += item.count, 0)}
    ]
  }
  return result;
}

export const getProfitData: (data: Analyzing.Request.ProfitData)=> Promise<Analyzing.Response.ProfitData> = async (data) => {
  let { Time, Loops, timeName } = getTime(data.date);

  const ET = new Date(Date.now())
  const ST = new Date(ET.getTime() - (Time * Loops))

  const purchases = await PurchaseService.getByDate(ST, ET,
    data.productId
  )

  const profite: Analyzing.ProfitData[] = [];

  while (profite.length < Loops) profite.push({
    deliveryPrice: 0,
    productsPrice: 0,
    totalPrice: 0,
    dateTime: 0
  })

  purchases.forEach((p)=> {
    const date = new Date(p.createdAt).getTime();
    const index = Math.floor((date - ST.getTime()) / Time);

    if (index >= 0 && index < Loops) {
      profite[index]!.deliveryPrice += p.deliveryPrice;
      profite[index]!.productsPrice += p.productPrice;
      profite[index]!.totalPrice += (p.productPrice * p.count) || 0
      profite[index]!.dateTime = profite[index]!.dateTime?? new Date(p.createdAt).setHours(0, 0, 0, 0)
    }
  })

  const reversedList = [...profite].reverse();
  const result: Analyzing.Response.ProfitData = {
    type: 'PROFTE',
    totalPrice: profite.reduce((value, item)=> value += item.productsPrice, 0),
    data: profite,
    date: data.date,
    skip: data.skip,
    info: [
      {name: `Last ${timeName} Profits`, value: reversedList[0]?.totalPrice || 0},
      {name: `Last 3 ${timeName}s Profits`, value: reversedList.slice(0, 3).reduce((value, item)=> value += item.totalPrice, 0) + 'DA'},
      {name: `Last 6 ${timeName}s Profits`, value: reversedList.slice(0, 6).reduce((value, item)=> value += item.totalPrice, 0) + 'DA'}
    ]
  }
  return result;
};


export const genral: ()=> Promise<Analyzing.Response.Genral> = async()=> {
  return {}
}