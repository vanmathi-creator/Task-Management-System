
import { useState } from "react";
import "./Auth.css";

function Login({ onLogin, onRegister, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const cleanEmail = email.trim().toLowerCase();

    const user = users.find(
      (u) =>
        u.email.trim().toLowerCase() === cleanEmail &&
        u.password === password
    );

    if (user) {
      alert("Login Successful!");
      onLogin(user);
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleLogin}>
        <h2>Welcome Back!</h2>
        <p>Login to your account</p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p>
          <span onClick={onForgot}>Forgot Password?</span>
        </p>

        <button type="submit">Login</button>

        <p>
          Don't have an account?
          <span onClick={onRegister}> Register</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
