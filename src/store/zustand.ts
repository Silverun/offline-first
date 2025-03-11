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
import { Alert } from "react-native";

export interface ExpensesStore {
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
          const expenseToRemove = get().expenses.find(
            (expense) => expense.id === id
          );
          set((state) => ({
            expenses: state.expenses.filter((expense) => expense.id !== id),
          }));
          if (isConnected) {
            await FirebaseRealtime.removeExpense(id);
          } else {
            // OFFLINE
            console.log("Expense to remove:", expenseToRemove);
            if (expenseToRemove) {
              queueStorage.addActionToQueue(
                QueueActions.REMOVE,
                expenseToRemove
              );
            } else {
              Alert.alert("Expense to remove was not found");
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
