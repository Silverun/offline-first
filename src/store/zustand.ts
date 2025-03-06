import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  QueueActions,
  queueStorage,
  STORAGE_KEYS,
  zustandMMKVStorage,
} from "../db/local/localdb";
import { expensesRef, FirebaseRealtime } from "../db/realtime";
import { Expense } from ".";

interface ExpensesStore {
  expenses: Expense[];
  addExpense: (expense: Expense, isConnected: boolean | null) => void;
  removeExpense: (id: string, isConnected: boolean | null) => void;
  setExpenses: (expenses: Expense[]) => void;
}

export const useExpenseStore = create<ExpensesStore>()(
  persist(
    (set, get) => {
      return {
        expenses: [],
        addExpense: async (expense, isConnected) => {
          set((state) => ({
            expenses: [...state.expenses, expense],
          }));
          if (isConnected) {
            await FirebaseRealtime.addExpense(expense);
          } else {
            //OFFLINE
            queueStorage.addActionToQueue(QueueActions.ADD, expense);
          }
        },
        removeExpense: async (id: string, isConnected) => {
          set((state) => ({
            expenses: state.expenses.filter((expense) => expense.id !== id),
          }));
          if (isConnected) {
            await FirebaseRealtime.removeExpense(id);
          } else {
            // OFFLINE
            const expense = get().expenses.find((expense) => expense.id === id);
            if (expense) {
              queueStorage.addActionToQueue(QueueActions.REMOVE, expense);
            }
          }
        },

        setExpenses: (expenses: Expense[]) => set({ expenses }),
      };
    },
    {
      name: STORAGE_KEYS.expensesStorage,
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
