import _ from 'lodash';
import fs from 'fs/promises';
import path from 'path';
import SystemError from '../../shared/system-error.js';
import * as Service from '../../shared/services.js'

const dataStorePath = path.join(process.cwd(), 'data');
const storeFilePath = path.join(dataStorePath, 'store.json');

export class DefaultStore implements Store {
  name = "store-name";
  description = "Description";
  contact: Store.Contact = {};
  media: Store.Media = {};
  private: Store.Private = {
    admins: [],
    pixels: {
      facebook: [],
      tiktok: [],
    }
  }
}

class StoreService {

  public static async getPrivateStore(): Promise<Store.Private> {
    const store = await this.getStore(true)
    return store.private!
  }

  public static async getAdminsList() {
    const store = await this.getStore(true)
    return store.private!.admins; 
  }

  public static async getStore(isAdmin?: boolean): Promise<Store> {
    await this.ensureStoreExists();
    const data = await fs.readFile(storeFilePath, { encoding: 'utf-8' });
    const store: Store = JSON.parse(data);
    if (isAdmin && store.private) {
      this.buildPrivateData(store)
    } else delete store.private;
    return store;
  }

  public static async updateStore(dataToUpdate: Partial<Store>): Promise<Store> {
    const oldStore = await this.getStore();
    const updatedStore = _.mergeWith({}, oldStore, dataToUpdate, this.updateDataReplace);
    await this.writeStore(updatedStore);

    return this.buildPrivateData(updatedStore);
  }

  private static buildPrivateData(store: Store) {
    if (store.private) {
      store.private.superAdmins = Service.getSystemSuperAdmins()
    }
    return store;
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
    if (Array.isArray(srcValue)) {
      return srcValue;
    }
    return undefined;
  }
}

export default StoreService;
