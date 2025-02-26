import { EXPENSE_CATEGORIES } from "../constants/data";

export function randomCategory() {
  const randomIndex = Math.floor(Math.random() * EXPENSE_CATEGORIES.length);
  return EXPENSE_CATEGORIES[randomIndex];
}
