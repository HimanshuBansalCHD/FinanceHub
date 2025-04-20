export const TRANSACTION_COLLECTION_NAME = "Transactions";
export const USER_TRANSACTIONS_SUB_COLLECTION_NAME = "userTransactions";
export const USER_COLLECTION_NAME = "users";
export const REGISTERED_USERS_DATA_COLLECTION_NAME = "registeredUsersData";
export const REGISTERED_USERS_DATA_SUB_COLLECTION_NAME = "data";

export const UPI_APPS_CONFIG = {
  google: {
    name: "Google Pay",
    scheme: "tez://upi/pay",
  },
  phonepe: {
    name: "PhonePe",
    scheme: "phonepe://upi/pay",
  },
  paytm: {
    name: "Paytm",
    scheme: "paytmmp://pay",
  },
};

export const CATEGORY_DATA = [
  { label: "Food", value: "Food" },
  { label: "Transport", value: "Transport" },
  { label: "Groceries", value: "Groceries" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Utilities", value: "Utilities" },
];
