
import { useState } from "react";
import "./Auth.css";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    const users = JSON.parse(
      localStorage.getItem("users") || "[]"
    );

    const cleanEmail = email.trim().toLowerCase();

    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (userIndex === -1) {
      alert("Email not registered!");
      return;
    }

    users[userIndex].password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated successfully!");
    onBack();
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleReset}>
        <h2>Forgot Password?</h2>
        <p>Enter your registered email and new password</p>

        <input
          type="email"
          placeholder="Enter Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          required
        />

        <button type="submit">Reset Password</button>

        <p>
          Remember your password?
          <span onClick={onBack}> Login</span>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
