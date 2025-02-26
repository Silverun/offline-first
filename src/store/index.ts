import { observable } from "@legendapp/state";
import {
  configureObservablePersistence,
  persistObservable,
} from "@legendapp/state/persist";
import { ObservablePersistFirebase } from "@legendapp/state/persist-plugins/firebase";
import { ObservablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onValue, getDatabase, ref } from "firebase/database";

interface State {
  expenses: Expense[];
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

const now = new Date().toLocaleString();

//////////// Firebase init
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBeF-QcB3886LCGGO82eN8J-0OXklwk88o",
  authDomain: "offline-first-e5e98.firebaseapp.com",
  databaseURL:
    "https://offline-first-e5e98-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "offline-first-e5e98",
  storageBucket: "offline-first-e5e98.firebasestorage.app",
  messagingSenderId: "592851523176",
  appId: "1:592851523176:web:5f6a9c622a7de161e64ddd",
};

initializeApp(firebaseConfig);
///////////////////////////////

configureObservablePersistence({
  pluginLocal: ObservablePersistAsyncStorage,
  localOptions: {
    asyncStorage: { AsyncStorage },
  },
});

export const state = observable<State>({
  expenses: [
    {
      id: "1",
      title: "Groceries",
      amount: 50.0,
      date: now,
    },
    {
      id: "2",
      title: "Electricity",
      amount: 75.0,
      date: now,
    },
  ],
});

persistObservable(state, {
  local: "store",
  pluginRemote: ObservablePersistFirebase,
  remote: {
    onSetError: (error) => {
      console.error(error);
    },
    firebase: {
      refPath: () => "/test/",
      // mode: "realtime",
    },
  },
});

const db = getDatabase();
const expensesRef = ref(db, "/test/");

// Listen for updates from Firebase and sync with local state
onValue(expensesRef, (snapshot) => {
  const data = snapshot.val();

  if (data) {
    console.log("Raw Firebase data:", data.expenses);
    state.expenses.set(data.expenses);
  }
});
