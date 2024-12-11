import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

// User registration component
function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username,
        email,
        password,
      });
      alert("User registered successfully");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}

// User login component
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );
      localStorage.setItem("token", response.data.token);
      alert("Login successful");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Product favorites page
function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    try {
      // This endpoint should return the user's favorites
      const response = await axios.get(
        "http://localhost:5000/api/users/favorites",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Error fetching favorites", error);
    }
  };

  const handleAddFavorite = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("You must be logged in");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/add-favorite",
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Favorite added");
      fetchFavorites(); // Refresh the favorites list after adding
    } catch (error) {
      console.error("Error adding favorite", error);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return alert("You must be logged in");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/remove-favorite",
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Favorite removed");
      fetchFavorites(); // Refresh the favorites list after removing
    } catch (error) {
      console.error("Error removing favorite", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        favorites.map((product) => (
          <div key={product._id}>
            <span>{product.name}</span>
            <button onClick={() => handleRemoveFavorite(product._id)}>
              Remove
            </button>
          </div>
        ))
      )}
      {/* Example to add a new favorite product */}
      <div>
        <button onClick={() => handleAddFavorite("some-product-id")}>
          Add Product to Favorites
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register">Register</Link> | <Link to="/login">Login</Link> |{" "}
        <Link to="/favorites">Favorites</Link>
      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
