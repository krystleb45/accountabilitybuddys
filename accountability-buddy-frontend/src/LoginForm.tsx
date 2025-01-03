import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Invalid email format.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate form submission or API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Form submitted successfully!");
    } catch (err) {
      setError("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      aria-label="Login Form"
      onSubmit={handleSubmit}
      noValidate
      className="login-form"
    >
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-required="true"
          aria-describedby={error ? "emailError" : undefined}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-required="true"
          aria-describedby={error ? "passwordError" : undefined}
          className="form-control"
        />
      </div>
      {error && (
        <p id="formError" className="error-message" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
