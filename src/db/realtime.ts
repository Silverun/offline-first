import { firebase, remove } from "@react-native-firebase/database";
import { Expense } from "../store";

// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyBeF-QcB3886LCGGO82eN8J-0OXklwk88o",
//   authDomain: "offline-first-e5e98.firebaseapp.com",
//   databaseURL:
//     "https://offline-first-e5e98-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "offline-first-e5e98",
//   storageBucket: "offline-first-e5e98.firebasestorage.app",
//   messagingSenderId: "592851523176",
//   appId: "1:592851523176:web:5f6a9c622a7de161e64ddd",
// };

// initializeApp(firebaseConfig);

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
