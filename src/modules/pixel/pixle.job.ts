import Translation, { loadEvents } from "./eventsTranslation.js";
import Track from "./index.js";


export default async function job() {
  await loadEvents()
  Track("CART_REMOVE" as Pixle.Events)
}