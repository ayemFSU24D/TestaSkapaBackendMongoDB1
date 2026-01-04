
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import GoogleLoginButton from "../components/GoogleLoginButton";
import EmailLogin from "../components/EmailLogin";
import { logout } from "../auth/logout";

const Signup: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(auth.currentUser);
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {user ? (
        <>
          <h2>Inloggad som {user.email}</h2>
          <button onClick={logout}>Logga ut</button>
        </>
      ) : (
        <>
          <GoogleLoginButton />
          <EmailLogin />
        </>
      )}

    </div>
  );
};

export default Signup;



