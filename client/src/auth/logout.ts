import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Utloggad!");
  } catch (error) {
    console.error("Fel vid utloggning:", error);
  }
};
