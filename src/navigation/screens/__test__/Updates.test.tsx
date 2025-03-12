import { render } from "@testing-library/react-native";
import { Updates } from "../Updates";
import { useExpenseStore } from "../../../store/zustand";
import { Text } from "react-native";

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

// ✅ Make useExpenseStore a Jest mock function so it can be modified in each test
jest.mock("../../../store/zustand", () => ({
  useExpenseStore: jest.fn(),
}));

describe("Updates Screen", () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useExpenseStore as unknown as jest.Mock).mockReturnValue({
      expenses: [],
      addExpense: jest.fn(),
      removeExpense: jest.fn(),
    });
  });

  test("render text top", () => {
    const { getAllByText } = render(<Updates />);
    expect(getAllByText("Online: ", { exact: false })).toBeTruthy();
  });

  test("renders list items when expenses exist", () => {
    // ✅ Modify the mocked Zustand store for this test
    (useExpenseStore as unknown as jest.Mock).mockReturnValue({
      expenses: [
        { id: "1", title: "Food", amount: 20, date: "2025-03-12" },
        { id: "2", title: "Transport", amount: 15, date: "2025-03-11" },
      ],
      addExpense: jest.fn(),
      removeExpense: jest.fn(),
    });

    // Render the component
    const { getByText } = render(<Updates />);

    // Assert that expenses appear
    expect(getByText("Food: $20")).toBeTruthy();
    expect(getByText("Transport: $15")).toBeTruthy();
  });
});
