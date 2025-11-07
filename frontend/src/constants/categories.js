import {
  FaUtensils,
  FaCar,
  FaShoppingBag,
  FaGamepad,
  FaFileInvoiceDollar,
  FaMedkit,
  FaGraduationCap,
  FaUser,
  FaQuestionCircle,
  FaMoneyBillWave,
  FaLaptopCode,
  FaStore,
  FaChartLine,
  FaGift,
} from "react-icons/fa";

export const categories = [
  // Expense Categories
  {
    id: 1,
    name: "Food & Dining",
    type: "expense",
    icon: FaUtensils,
    color: "bg-orange-500",
  },
  {
    id: 2,
    name: "Transportation",
    type: "expense",
    icon: FaCar,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Shopping",
    type: "expense",
    icon: FaShoppingBag,
    color: "bg-pink-500",
  },
  {
    id: 4,
    name: "Entertainment",
    type: "expense",
    icon: FaGamepad,
    color: "bg-purple-500",
  },
  {
    id: 5,
    name: "Bills & Utilities",
    type: "expense",
    icon: FaFileInvoiceDollar,
    color: "bg-yellow-500",
  },
  {
    id: 6,
    name: "Healthcare",
    type: "expense",
    icon: FaMedkit,
    color: "bg-red-500",
  },
  {
    id: 7,
    name: "Education",
    type: "expense",
    icon: FaGraduationCap,
    color: "bg-green-500",
  },
  {
    id: 8,
    name: "Personal Care",
    type: "expense",
    icon: FaUser,
    color: "bg-indigo-500",
  },
  {
    id: 9,
    name: "Other Expenses",
    type: "expense",
    icon: FaQuestionCircle,
    color: "bg-gray-500",
  },

  // Income Categories
  {
    id: 10,
    name: "Salary",
    type: "income",
    icon: FaMoneyBillWave,
    color: "bg-green-500",
  },
  {
    id: 11,
    name: "Freelance",
    type: "income",
    icon: FaLaptopCode,
    color: "bg-blue-500",
  },
  {
    id: 12,
    name: "Business",
    type: "income",
    icon: FaStore,
    color: "bg-purple-500",
  },
  {
    id: 13,
    name: "Investment",
    type: "income",
    icon: FaChartLine,
    color: "bg-indigo-500",
  },
  { id: 14, name: "Gift", type: "income", icon: FaGift, color: "bg-pink-500" },
  {
    id: 15,
    name: "Other Income",
    type: "income",
    icon: FaQuestionCircle,
    color: "bg-gray-500",
  },
];

export const EXPENSE_CATEGORIES = categories
  .filter((cat) => cat.type === "expense")
  .map((cat) => cat.name);
export const INCOME_CATEGORIES = categories
  .filter((cat) => cat.type === "income")
  .map((cat) => cat.name);

export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
};
