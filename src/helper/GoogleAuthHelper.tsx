// utils/googleAuth.ts
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { Platform } from "react-native";

export const signInWithGoogle = () => {
  const clientId =
    Platform.OS === "ios"
      ? "<YOUR_IOS_CLIENT_ID>"
      : Platform.OS === "android"
      ? "<YOUR_ANDROID_CLIENT_ID>"
      : "<YOUR_WEB_CLIENT_ID>";

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
  });

  const handleGoogleLogin = async (response: any) => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    }
  };

  return { request, response, promptAsync, handleGoogleLogin };
};
