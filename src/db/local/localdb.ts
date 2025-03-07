import { MMKV } from "react-native-mmkv";
import { Expense } from "../../store";
import { FirebaseRealtime } from "../realtime";

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
    console.log("Queue cleared");
  },
  processQueue: async () => {
    console.log("Processing queue...");
    const currentQueue = queueStorage.getQueue();
    if (currentQueue.length === 0) return;

    const promises = currentQueue.map((action) => {
      switch (action.type) {
        case QueueActions.ADD: {
          return FirebaseRealtime.addExpense(action.payload);
        }
        case QueueActions.REMOVE: {
          return FirebaseRealtime.removeExpense(action.payload.id);
        }
        default: {
          console.warn("Unknown action type:", action?.type);
          return Promise.resolve();
        }
      }
    });
    // Add partial completions case for retry
    try {
      const results = await Promise.allSettled(promises);
      console.log("Queue processing results:", results);
      return results;
    } catch (error) {
      console.error("Failed to process queue:", error);
    } finally {
      queueStorage.clearQueue();
    }
  },
};
