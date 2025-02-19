import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user was remembered
    const storedEmail = localStorage.getItem("rememberMe");
    if (storedEmail) {
      setEmail(storedEmail);
      setRememberMe(true);
    }

    // Auto-login if already authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem("rememberMe", email);
      } else {
        localStorage.removeItem("rememberMe");
      }

      navigate("/"); // Redirect to Home after login
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label className="remember-me">
            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} /> Remember Me
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
