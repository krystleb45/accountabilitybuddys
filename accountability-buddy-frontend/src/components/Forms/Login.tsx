import React, { useState } from "react";
import { useAuth } from "src/context/auth/AuthContext"; // Use the custom useAuth hook
import styles from "./Forms.module.css"; // Import CSS module for styling
import { validateEmail } from "./FormsUtils"; // Reuse email validation utility

const Login: React.FC = () => {
  const { login } = useAuth(); // Use the custom hook to get the login function
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    // Validate input fields
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Password is required.");
      setLoading(false);
      return;
    }

    try {
      const token = "exampleAuthToken"; // Replace with actual token from your API response
      login(token); // Call the login function from AuthContext
    } catch (error: any) {
      setError("Failed to log in. Please check your credentials and try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={styles["form-container"]}>
      <h1>Login</h1>
      {error && <p className={styles["error-message"]}>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className={styles["form"]}
      >
        <label htmlFor="email" className={styles["label"]}>
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles["input"]}
          aria-label="Email"
          required
        />
        <label htmlFor="password" className={styles["label"]}>
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles["input"]}
          aria-label="Password"
          required
        />
        <button
          type="submit"
          className={styles["submit-button"]}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
