import { Button, Text } from "@react-navigation/elements";
import { FlatList, Platform, Pressable, StyleSheet, View } from "react-native";
import { state } from "../../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { randomCategory } from "../../utils/randomCat";
import { observer } from "@legendapp/state/react";
// import * as Network from "expo-network";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

export const Updates = observer(() => {
  const expenses = state.expenses.get();
  const [online, setOnline] = useState<boolean | null>();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(
      ({ isConnected, isInternetReachable, type }) => {
        console.log(
          `Platform: ${Platform.OS} | Network type: ${type}, Connected: ${isConnected}, Internet Reachable: ${isInternetReachable}`
        );
        setOnline((prev) => (isConnected !== prev ? isConnected : prev));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const addExpense = () => {
    const newExpense = {
      id: Math.random().toString(),
      title: randomCategory(),
      amount: Math.floor(Math.random() * 101),
      date: new Date().toLocaleString(),
    };

    state.expenses.set((currentExpenses) => [...currentExpenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    state.expenses.set((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.online}>Online: {online ? "yes" : "no"}</Text>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => deleteExpense(item.id)}
            style={styles.renderItem}
          >
            <Text style={styles.itemName}>
              {item.title}: ${item.amount}
            </Text>
            <Text>{item.date}</Text>
          </Pressable>
        )}
      />
      <Button onPress={addExpense}>Add Expense</Button>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  contentContainer: {
    gap: 10,
  },
  online: {
    fontSize: 22,
    fontWeight: "semibold",
  },
  renderItem: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    backgroundColor: "white",
    gap: 4,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
