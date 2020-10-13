// import { openDB } from 'idb';
import { openDB } from "https://unpkg.com/idb?module";
// import CONFIG from '../global/config'
const CONFIG = {
  DB_NAME: "push-notif-app",
  DB_VERSION: 1,
  OBJECT_STORE_NAME: "subscriber",
};

const { DB_NAME, DB_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

const SubscriberData = {
  async getAll() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putSubscriber(data) {
    return (await dbPromise).put(OBJECT_STORE_NAME, data);
  },
  async deleteSubscriber(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default SubscriberData;
