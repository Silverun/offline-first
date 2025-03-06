import { Button, Text } from "@react-navigation/elements";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { randomCategory } from "../../utils/randomCat";
import { useNetInfo } from "@react-native-community/netinfo";
import { useExpenseStore } from "../../store/zustand";
import { QueueActions, queueStorage } from "../../db/local/localdb";

export const Updates = () => {
  const { isConnected } = useNetInfo();
  const { expenses, addExpense, removeExpense } = useExpenseStore();

  const addExpenseHandler = () => {
    const newExpense = {
      id: Math.random().toString().replace(".", ""),
      title: randomCategory(),
      amount: Math.floor(Math.random() * 101),
      date: new Date().toLocaleString(),
    };
    addExpense(newExpense, isConnected);
  };

  const deleteExpenseHandler = (id: string) => {
    removeExpense(id, isConnected);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.online}>Online: {isConnected ? "yes" : "no"}</Text>
      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => deleteExpenseHandler(item.id)}
            style={styles.renderItem}
          >
            <Text style={styles.itemName}>
              {item.title}: ${item.amount}
            </Text>
            <Text>{item.date}</Text>
          </Pressable>
        )}
      />
      <Button onPress={addExpenseHandler}>Add Expense</Button>
    </SafeAreaView>
  );
};

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
