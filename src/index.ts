import dotenv from 'dotenv'
import path from 'path'
import logger from './shared/logger.js'
import connectDb from './config/connect-db.js'
import SystemError from './shared/system-error.js'

dotenv.config({
  path: path.join(process.cwd(), '.env')
})

const main = async()=> {
  try{
    await connectDb()
    await import('./app.js')
  }catch(e: any) {

    if (e instanceof SystemError) {
      logger.error(`System Error: ${e.stack}\n> ${e.message}`)
      e.exit(0);
      return;
    }

    logger.error({
      message: 'Error in Running app',
      error: e.message
    })
  }
}

setTimeout(main, 100)
