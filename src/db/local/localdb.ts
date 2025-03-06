import { MMKV } from "react-native-mmkv";
import { Expense } from "../../store";

export const STORAGE_KEYS = {
  expensesStorage: "expenses-storage",
  expensesQueue: "expenses-queue",
} as const;

const expensesStorage = new MMKV({ id: STORAGE_KEYS.expensesStorage });
const expensesQueue = new MMKV({ id: STORAGE_KEYS.expensesQueue });

export const zustandMMKVStorage = {
  getItem: (name: string) => {
    console.log(name, "has been retrieved");
    const value = expensesStorage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    console.log(name, "with value", value, "has been saved");
    expensesStorage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    console.log(name, "has been deleted");
    expensesStorage.delete(name);
  },
};

export enum QueueActions {
  ADD = "add",
  REMOVE = "remove",
}
interface QueueAction {
  type: QueueActions;
  payload: Expense;
}

export const queueStorage = {
  addActionToQueue: (actionType: QueueActions, payload: Expense) => {
    const newAction = {
      type: actionType,
      payload: payload,
    };
    const currentQueue = queueStorage.getQueue();
    currentQueue.push(newAction);

    expensesQueue.set(STORAGE_KEYS.expensesQueue, JSON.stringify(currentQueue));
    console.log("Queue updated:", currentQueue);
  },
  getQueue: () => {
    const readQueue = expensesQueue.getString(STORAGE_KEYS.expensesQueue);
    let currentQueue: QueueAction[];
    if (readQueue) {
      currentQueue = JSON.parse(readQueue);
    } else {
      currentQueue = [];
    }
    return currentQueue;
  },
  clearQueue: () => {
    expensesQueue.delete(STORAGE_KEYS.expensesQueue);
  },
  processQueue: (set: any) => {
    const currentQueue = queueStorage.getQueue();
    currentQueue.forEach((action) => {
      switch (action.type) {
        case QueueActions.ADD: {
        }
      }
    });
    queueStorage.clearQueue();
  },
};
