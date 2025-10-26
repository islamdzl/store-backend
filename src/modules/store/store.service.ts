import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import SystemError from '../../shared/system-error.js';

const dataStorePath = path.join(process.cwd(), 'data');
const storeFilePath = path.join(dataStorePath, 'store.json');

export class DefaultStore implements Store {
  name = "store-name";
  description = "Description";
  banner?: string | undefined;
  contact: Store.Contact = {};
}

class StoreService {
  public static async getStore(): Promise<Store> {
    await this.ensureStoreExists();
    const data = await fs.readFile(storeFilePath, { encoding: 'utf-8' });
    return JSON.parse(data);
  }

  public static async updateStore(dataToUpdate: Partial<Store>): Promise<Store> {
    const oldStore = await this.getStore();
    const updatedStore = _.mergeWith({}, oldStore, dataToUpdate, this.updateDataReplace);
    await this.writeStore(updatedStore);
    return updatedStore;
  }

  private static async writeStore(updatedStore: Store): Promise<void> {
    await this.ensureStoreExists();
    try {
      await fs.writeFile(
        storeFilePath,
        JSON.stringify(updatedStore, this.writeDataReplace, 2),
        { encoding: 'utf8' }
      );
    } catch {
      throw new SystemError('Error writing store file');
    }
  }

  private static async ensureStoreExists(): Promise<void> {
    try {
      await fs.access(storeFilePath);
    } catch {
      await fs.mkdir(dataStorePath, { recursive: true });
      await fs.writeFile(storeFilePath, JSON.stringify(new DefaultStore(), null, 2));
    }
  }

  private static writeDataReplace(key: string, value: unknown) {
    return value;
  }

  private static updateDataReplace(objValue: unknown, srcValue: unknown) {
    return undefined;
  }
}

export default StoreService;
