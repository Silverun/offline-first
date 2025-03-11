import { firebase, remove } from "@react-native-firebase/database";
import { Expense } from "../store";

export const db = firebase
  .app()
  .database(
    "https://offline-first-e5e98-default-rtdb.europe-west1.firebasedatabase.app/"
  )
  .ref("test");

export const expensesRef = db.child("expenses");

export const FirebaseRealtime = {
  addExpense: async (expense: Expense) => {
    try {
      const newExpenseRef = expensesRef.child(expense.id);
      await newExpenseRef.set(expense);
      console.log("Expense added to Firebase:", expense);
    } catch (error) {
      console.error("Failed to add expense to Firebase:", error);
    }
  },
  removeExpense: async (id: string) => {
    try {
      await remove(expensesRef.child(id));
      console.log("Expense removed from Firebase");
    } catch (error) {
      console.error("Failed to remove expense from Firebase:", error);
    }
  },
};
