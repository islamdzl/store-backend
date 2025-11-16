import mongoose from "mongoose";
export const isAdmin = (email) => {
    const admins = JSON.parse(process.env.ADMINS || "[]");
    return admins.includes(email);
};
export const withSession = async (callBack) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const result = await callBack(session);
        await session.commitTransaction();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
//# sourceMappingURL=services.js.map