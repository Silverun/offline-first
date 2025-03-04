import { useEffect } from "react";
import { expensesRef } from "../db/realtime";
import { useExpenseStore } from "../store/zustand";
import { Expense } from "../store";
import {} from "firebase/database";
import { useNetInfo } from "@react-native-community/netinfo";

type OnCallback = Parameters<typeof expensesRef.on>[1];

export const useFirebaseSync = () => {
  const { setExpenses } = useExpenseStore();
  const { isConnected } = useNetInfo();

  const onValueChange: OnCallback = (snapshot) => {
    const data = snapshot.val();
    const firebaseExpenses: Expense[] = data ? Object.values(data) : [];
    console.log("Firebase Sync:", firebaseExpenses);
    // Sync Firebase expenses with local state
    setExpenses(firebaseExpenses);
  };

  useEffect(() => {
    // Listen for Firebase updates
    if (!isConnected) return;
    expensesRef.on("value", onValueChange);
    return () => expensesRef.off("value", onValueChange);
  }, [isConnected]);
};
