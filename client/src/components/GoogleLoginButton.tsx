import { loginWithGoogle } from "../auth/googleAuth";

const GoogleLoginButton: React.FC = () => {
  return (
    <button onClick={() => loginWithGoogle()}>
      Logga in with Google
    </button>
  );
};

export default GoogleLoginButton;
