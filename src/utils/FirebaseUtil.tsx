import { db, auth } from "../config/firebase";
import { collection, setDoc, addDoc, doc } from "firebase/firestore";
import { Alert } from "react-native";
import { CollectionReference, DocumentReference } from "firebase/firestore";
import {
  TRANSACTION_COLLECTION_NAME,
  USER_TRANSACTIONS_SUB_COLLECTION_NAME,
  USER_COLLECTION_NAME,
  REGISTERED_USERS_DATA_COLLECTION_NAME,
  REGISTERED_USERS_DATA_SUB_COLLECTION_NAME,
} from "./Constants";
import { cachedUserId } from "./common";

export function getUserId(): string {
  const user = auth.currentUser;
  if (!user) {
    Alert.alert("User not logged in");
    return "";
  }
  return user.uid;
}

export function getTransactionsCollection(): any {
  try {
    return collection(
      db,
      TRANSACTION_COLLECTION_NAME,
      cachedUserId,
      USER_TRANSACTIONS_SUB_COLLECTION_NAME
    );
  } catch (error) {
    console.error("Error getting transactions reference:", error);
    throw error;
  }
}

export function getRegisteredUsersCollection(): any {
  try {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("User not logged in");
      return null; // Ensure a valid return type
    }
    return collection(
      db,
      REGISTERED_USERS_DATA_COLLECTION_NAME,
      getUserId(),
      REGISTERED_USERS_DATA_SUB_COLLECTION_NAME
    );
  } catch (error) {
    console.error("Error getting registeredUsersData reference:", error);
    throw error;
  }
}

export async function addDocumentToCollection<T>(
  collectionRef: CollectionReference<T>,
  data: T
): Promise<DocumentReference<T>> {
  try {
    const docRef = await addDoc(collectionRef, data);
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

export async function setDocument(
  collectionName: string,
  data: any,
  userId: string
) {
  console.log("Setting document in collection:", userId);
  await setDoc(doc(db, collectionName, userId), data, { merge: true });
}
