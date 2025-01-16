import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Use the custom useAuth hook

const Login: React.FC = () => {
  const { login } = useAuth(); // Use the custom hook to get the login function
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    // Example login logic: This is where you'd authenticate the user
    try {
      const token = "exampleAuthToken"; // Replace with actual token from your API response
      login(token); // Call the login function from AuthContext
    } catch (error) {
      console.error("Failed to log in:", error);
      // Handle login error
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
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
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
