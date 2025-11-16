export declare class DefaultStore implements Store {
    name: string;
    description: string;
    contact: Store.Contact;
    media: Store.Media;
}
declare class StoreService {
    static getStore(): Promise<Store>;
    static updateStore(dataToUpdate: Partial<Store>): Promise<Store>;
    private static writeStore;
    private static ensureStoreExists;
    private static writeDataReplace;
    private static updateDataReplace;
}
export default StoreService;
//# sourceMappingURL=store.service.d.ts.map