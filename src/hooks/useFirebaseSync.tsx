import { useCallback, useEffect } from "react";
import { expensesRef } from "../db/realtime";
import { useExpenseStore } from "../store/zustand";
import { Expense } from "../store";
import {} from "firebase/database";
import { useNetInfo } from "@react-native-community/netinfo";
import { queueStorage } from "../db/local/localdb";

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

  const sync = useCallback(async () => {
    await queueStorage.processQueue();
    expensesRef.on("value", onValueChange);
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    sync();
    return () => expensesRef.off("value", onValueChange);
  }, [isConnected]);
};
