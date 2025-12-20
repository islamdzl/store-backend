import fetch from "node-fetch";
import logger from "../../shared/logger.js";

let isloggedError_facebook = false;
let isloggedError_tiktok = false;

const logError: (error: any, pixle: string, platform: string)=> void = (error, pixle, platform)=> {
  logger.warn({
    message: `Error in ${platform} Pixle`,
    pixleID: pixle,
    ...error
  })
}

export const facebook = async(pixleId: string, event: any)=> {
  const access_token: string = process.env.ACCESS_TOKEN_FACEBOOK! 


  const payload: any = {
    data: [
      {
        event_name: event,
        event_time: Date.now(),
        // user_data: {
        //   client_ip_address: "123.123.123.123",
        //   client_user_agent: "Mozilla/5.0"
        // },
        // custom_data: {
        //   currency: "DZD",
        //   value: 99.99
        // },
        // event_source_url: "https://yourwebsite.com/product/123"
      }
    ]
  }

  fetch(`https://graph.facebook.com/v17.0/${pixleId}/events?access_token=${access_token}`, {
    headers: {
      "Content-Type": 'application/json'
    },
    method: 'POST',
    body: payload
  })
  .then(async(res)=> {
    if (! res.ok) {
      if (! isloggedError_facebook) {
        isloggedError_facebook = true
        logError(JSON.parse(await res.text()), pixleId, 'facebook')
      }
    }
  })
  .catch((error)=> {
    logger.error({
      message: 'ERROR fetch data facebook pixle',
      source: 'Pixle > facebook',
      error
    })
  })
}


export const tiktok = async(pixleId: string, event: any)=> {
  const access_token: string = process.env.ACCESS_TOKEN_TIKTOK! 

  const payload: any = {
    pixel_code: pixleId,
    event: event,
    timestamp: Math.floor(Date.now() / 1000),    // context: {
    //   ip: "123.123.123.123",
    //   user_agent: "Mozilla/5.0",
    //   page_url: "https://yourwebsite.com/product/123"
    // },
    // properties: {
    //   currency: "DZD",
    //   value: 99.99
    // }
  }


  fetch(`https://business-api.tiktok.com/open_api/v1.3/event/track/`, {
    headers: {
      "Content-Type": 'application/json',
      "Authorization": `Bearer ${access_token}`
    },
    method: 'POST',
    body: payload
  })
  .then(async(res)=> {
    if (! res.ok) {
      if (! isloggedError_tiktok) {
        isloggedError_tiktok = true
        logError(JSON.parse(await res.text()), pixleId, 'tiktok')
      }
    }
  })
  .catch((error)=> {
    logger.error({
      message: 'ERROR fetch data tiktok pixle',
      source: 'Pixle > tiktok',
      error
    })
  })
}