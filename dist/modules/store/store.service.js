import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import SystemError from '../../shared/system-error.js';
const dataStorePath = path.join(process.cwd(), 'data');
const storeFilePath = path.join(dataStorePath, 'store.json');
export class DefaultStore {
    name = "store-name";
    description = "Description";
    contact = {};
    media = {};
}
class StoreService {
    static async getStore() {
        await this.ensureStoreExists();
        const data = await fs.readFile(storeFilePath, { encoding: 'utf-8' });
        return JSON.parse(data);
    }
    static async updateStore(dataToUpdate) {
        const oldStore = await this.getStore();
        const updatedStore = _.mergeWith({}, oldStore, dataToUpdate, this.updateDataReplace);
        await this.writeStore(updatedStore);
        return updatedStore;
    }
    static async writeStore(updatedStore) {
        await this.ensureStoreExists();
        try {
            await fs.writeFile(storeFilePath, JSON.stringify(updatedStore, this.writeDataReplace, 2), { encoding: 'utf8' });
        }
        catch {
            throw new SystemError('Error writing store file');
        }
    }
    static async ensureStoreExists() {
        try {
            await fs.access(storeFilePath);
        }
        catch {
            await fs.mkdir(dataStorePath, { recursive: true });
            await fs.writeFile(storeFilePath, JSON.stringify(new DefaultStore(), null, 2));
        }
    }
    static writeDataReplace(key, value) {
        return value;
    }
    static updateDataReplace(objValue, srcValue) {
        return undefined;
    }
}
export default StoreService;
//# sourceMappingURL=store.service.js.map