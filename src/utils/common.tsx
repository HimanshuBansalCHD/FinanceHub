import * as Crypto from "expo-crypto";
import { getDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { USER_COLLECTION_NAME } from "./Constants";

export let cachedUserId: string;
let cachedEmail: string;

export async function getUserIdFromEmail(emailId: string): Promise<string> {
  const normalized = emailId.trim().toLowerCase();

  if (cachedUserId && cachedEmail === normalized) {
    return cachedUserId;
  }

  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    normalized
  );
  const alphanumericOnly = hash.replace(/[^a-z0-9]/gi, "").slice(0, 32);

  cachedUserId = alphanumericOnly;
  cachedEmail = normalized;

  return cachedUserId;
}

async function checkUserIdOnFirestore(userId: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, USER_COLLECTION_NAME, userId));
  return userDoc.exists();
}
export async function isExistingUser(
  userId: string | null = null,
  emailId: string | null = null
): Promise<boolean> {
  if (!userId && !emailId) {
    throw new Error("Either userId or email must be provided.");
  }

  if (!userId && emailId) {
    userId = await getUserIdFromEmail(emailId);
  }

  if (!userId) {
    throw new Error("Invalid userId after processing.");
  }
  return await checkUserIdOnFirestore(userId);
}
