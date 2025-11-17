import { openDB } from "idb";

export const launchDB = await openDB("launch-database", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("pastLaunches")) {
      db.createObjectStore("pastLaunches");
    }
    if (!db.objectStoreNames.contains("upcomingLaunch")) {
      db.createObjectStore("upcomingLaunch");
    }
    if (!db.objectStoreNames.contains("timestamps")) {
      db.createObjectStore("timestamps");
    }
  },
});

// Helpers
export async function setDB(store, key, value) {
  return launchDB.put(store, value, key);
}

export async function getDB(store, key) {
  return launchDB.get(store, key);
}
