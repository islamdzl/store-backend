import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from './logger.js';
import * as Statics from './statics.js';
import AppResponse, { ScreenMessageType } from './app-response.js';
const hashSalt = 13;
if (!process.env.JWT_SECRET) {
    logger.warn('[.ENV]: JWT_SECRET is required');
}
const JWTSecretKey = process.env.JWT_SECRET || 'SECRET_KEY';
export const YMD = (before, after) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `/${before ? '/' + before + year : year}/${month}/${day}/${after ? '/' + after : ''}`;
};
export const hashPassword = async (rowPassword) => {
    return await bcrypt.hash(rowPassword, hashSalt);
};
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
export const jwtSign = (payload) => {
    return jwt.sign(payload, JWTSecretKey, { expiresIn: '30d' });
};
export const jwtVerify = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWTSecretKey, (error, payload) => {
            if (error) {
                return reject(new AppResponse(400)
                    .setScreenMessage('please ReLogin', ScreenMessageType.WARN)
                    .reLogIn());
            }
            resolve(payload);
        });
    });
};
export const buildXLSXFileJSONDataOf_orders = (data) => {
    return data
        .map((doc) => ({
        'Customer Name': doc.buyingDetails.fullName,
        'PhoneA': doc.buyingDetails.phone1,
        'PhoneB': doc.buyingDetails.phone2,
        'Bladia': doc.buyingDetails.city,
        'Wilaya': doc.buyingDetails.state,
        'Description': doc.buyingDetails.note,
        'Delivery To': doc.buyingDetails.deliveryToHome ? 'To Home' : 'To Offes',
        'Quantity': doc.count,
        'Total Price': String(((doc.productPrice - doc.promo || 0) * doc.count) + doc.deliveryPrice),
        'Date': doc.createdAt.toISOString(),
        'Status': doc.status,
        'Product ID': doc.product.toString(),
    }));
};
//# sourceMappingURL=utils.js.map