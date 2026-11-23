
import { useState } from "react";
import "./Auth.css";

function Register({ onRegister, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const cleanEmail = email.trim().toLowerCase();

    const exists = users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (exists) {
      alert("User already exists! Please login.");
      onRegister();
      return;
    }

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    alert("Registration Successful!");
    onLogin(newUser);
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleRegister}>
        <h2>Create Account</h2>
        <p>Register to manage your tasks</p>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          minLength={6}
          required
        />

        <button type="submit">Register</button>

        <p>
          Already have an account?
          <span onClick={onRegister}> Login</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
