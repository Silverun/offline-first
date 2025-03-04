import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

const STORAGE_KEY = "expenses";

export const zustandMMKVStorage = {
  getItem: (name: string) => {
    console.log(name, "has been retrieved");
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    console.log(name, "with value", value, "has been saved");
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    console.log(name, "has been deleted");
    storage.delete(name);
  },
};

export default storage;
