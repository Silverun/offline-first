import { firebase } from "@react-native-firebase/database";

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
