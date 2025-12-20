import StoreService from "../store/store.service.js"
import * as PixleService from './pixle.service.js'
import Translation from "./eventsTranslation.js"

export default async function Track(event: Pixle.Events) {
  const { pixels } = await StoreService.getPrivateStore()
  let promises_facebook : Promise<any>[] = []
  let promises_tiktok   : Promise<any>[] = []
  if (process.env.ACCESS_TOKEN_FACEBOOK) {
    promises_facebook = pixels.facebook.map((pxleId)=> PixleService.facebook(pxleId, Translation(event, 'FACEBOOK')))
  }
  if (process.env.ACCESS_TOKEN_TIKTOK) {
    promises_tiktok = pixels.tiktok.map((pxleId)=> PixleService.tiktok(pxleId, Translation(event, 'TIKTOK')))
  }
  
  await Promise.all([
    ...promises_tiktok,
    ...promises_facebook
  ])
}