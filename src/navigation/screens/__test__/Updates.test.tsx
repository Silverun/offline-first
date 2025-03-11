// src/navigation/screens/__test__/Updates.test.tsx
jest.mock("@react-native-firebase/database", () => ({
  firebase: {
    database: jest.fn(),
  },
}));

jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: () => ({
    isConnected: true,
  }),
}));

jest.mock("../../../store/zustand", () => ({
  useExpenseStore: () => ({
    expenses: [],
    addExpense: jest.fn(),
    removeExpense: jest.fn(),
  }),
}));

import { render } from "@testing-library/react-native";
import { Updates } from "../Updates";

describe("Updates Screen", () => {
  test("render text top", () => {
    const { getByText } = render(<Updates />);
    getByText("Online: yes");
  });
});
