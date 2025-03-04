import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandMMKVStorage } from "../db/local/localdb";
import { expensesRef } from "../db/realtime";
import { Expense } from ".";
import { get, push, ref, remove } from "firebase/database";
import { useNetInfo } from "@react-native-community/netinfo";

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
            try {
              const newExpenseRef = expensesRef.push();
              await newExpenseRef.set(expense);
              console.log("Expense added to Firebase:", expense);
            } catch (error) {
              console.error("Failed to add expense to Firebase:", error);
            }
          } else {
            console.log("Offline: Expense not sent to Firebase");
          }
        },

        removeExpense: async (id: string, isConnected) => {
          set((state) => ({
            expenses: state.expenses.filter((expense) => expense.id !== id),
          }));

          if (isConnected) {
            try {
              const snapshot = await expensesRef.
              const data = snapshot.val();

              const keyToRemove = Object.keys(data).find(
                (key) => data[key].id === id
              );

              if (keyToRemove) {
                await remove(ref(expensesRef, keyToRemove));
                console.log("Expense removed from Firebase:", id);
              }
            } catch (error) {
              console.error("Failed to remove expense from Firebase:", error);
            }
          } else {
            console.log("Offline: Expense not removed from Firebase");
          }
        },

        setExpenses: (expenses: Expense[]) => set({ expenses }),
      };
    },
    {
      name: "expenses-storage",
      storage: createJSONStorage(() => zustandMMKVStorage),
    }
  )
);
