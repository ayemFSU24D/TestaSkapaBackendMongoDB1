import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = (): Promise<UserCredential> => {
  return signInWithPopup(auth, provider);
};
