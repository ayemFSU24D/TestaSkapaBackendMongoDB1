import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import GoogleLoginButton from "../components/GoogleLoginButton";
import EmailLogin from "../components/EmailLogin";
import { logout } from "../auth/logout";

const Signup: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {user ? "Account" : "Log in"}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {user
              ? "You are currently logged in"
              : "Log in to access the 3D model and features"}
          </p>
        </div>

        {/* Content */}
        {user ? (
          <div className="space-y-4 text-center">
            <p className="text-gray-700">
              Logged in as
              <br />
              <span className="font-semibold">{user.email}</span>
            </p>

            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <GoogleLoginButton />

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-300" />
              or
              <div className="flex-1 h-px bg-gray-300" />
            </div>

            <EmailLogin />
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;




