import dotenv from 'dotenv'
import path from 'path'
import logger from './shared/logger.js'
import connectDb from './config/connect-db.js'
import SystemError from './shared/system-error.js'
import express from 'express'

dotenv.config({
  path: path.join(process.cwd(), '.env')
})

const PORT = 2007;

const main = async()=> {
  try{
    await connectDb()
    const app = (await import('./app.js')).default;
    app.listen(PORT, '0.0.0.0', ()=> {
      logger.info(`Server listen in port: ${PORT}`)
    })

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
