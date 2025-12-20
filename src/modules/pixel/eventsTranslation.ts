let Events: any = null

export default async function Translation(event: Pixle.Events, platform: Pixle.Platforms) {
  if (Events[event]) {
    if (Events[event][platform]) {
      return Events[event][platform]
    }
  }
  return null
}

export const loadEvents = async()=> {
  if (! Events) {
    Events = await import('./events.json') as any;
  }
}