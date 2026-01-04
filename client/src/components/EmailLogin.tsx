import { useState } from "react";
import { login, register } from "../auth/emailAuth";

const EmailLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={() => login(email, password)}>
        Logga in
      </button>

      <button onClick={() => register(email, password)}>
        Registrera
      </button>
    </div>
  );
};

export default EmailLogin;
