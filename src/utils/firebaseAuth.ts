import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase/config";

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
