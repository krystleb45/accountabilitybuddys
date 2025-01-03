import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate email and password
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Form submitted successfully!');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form aria-label="Login Form" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          aria-required="true"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby="email-error"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          aria-required="true"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!error}
          aria-describedby="password-error"
        />
      </div>

      {error && (
        <div id="form-error" role="alert" aria-live="assertive" style={{ color: 'red', marginTop: '8px' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
