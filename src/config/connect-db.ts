import mongoose from "mongoose";
import SystemError from "../shared/system-error.js";
import logger from "../shared/logger.js";

const connect = async () => {
  if (!process.env.DATABASE_URL) {
    throw new SystemError('[.ENV] Invalid "DATABASE_URL"');
  }
  await mongoose.connect(process.env.DATABASE_URL, {
    tls: true,
    tlsAllowInvalidCertificates: false,
  })
  .then(() => logger.info('[DATABASE]: Connected Successfully'))
  .catch(err => {
    logger.error('[DATABASE]: Connection Failed', err);
    process.exit(1);
  });
};

mongoose.connection.on('disconnected', () => {
  logger.warn('[DATABASE]: Connection lost, reconnecting...');
  connect();
});

mongoose.connection.on('reconnected', () => {
  logger.warn('[DATABASE]: Reconnected');
});
mongoose.connection.on('error', (e) => {
  logger.error(`[DATABASE]: ${e}`);
});

export default connect;
